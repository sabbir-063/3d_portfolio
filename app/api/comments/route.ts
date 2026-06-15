import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAllPostsMeta } from "@/lib/blog";

// Comments need live DB reads/writes — never statically cached.
export const dynamic = "force-dynamic";

// ── In-memory rate limiter (per IP, resets on cold start — fine for a blog) ────
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 10; // max 10 comments per IP per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  rateLimitMap.set(ip, [...timestamps, now]);
  return false;
}

// ── Validators ────────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_PATTERN = /https?:\/\/|www\.\S+|\.\w{2,}\//i;

function validate(name: string, email: string, body: string): string | null {
  if (!name || !email || !body) return "Name, email, and comment are required.";
  if (name.length < 2 || name.length > 80) return "Name must be between 2 and 80 characters.";
  if (!EMAIL_REGEX.test(email)) return "Invalid email address.";
  if (body.length < 2) return "Comment is too short.";
  if (body.length > 3000) return "Comment is too long.";
  if (URL_PATTERN.test(name)) return "Name contains invalid content.";
  if (URL_PATTERN.test(body)) return "Comment contains invalid content.";
  return null;
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ── Types returned to the client (no email) ────────────────────────────────────
type Reply = {
  id: number;
  authorName: string;
  body: string;
  createdAt: string;
  replyToName: string | null;
};
type CommentNode = {
  id: number;
  authorName: string;
  body: string;
  createdAt: string;
  replies: Reply[];
};

type Row = {
  id: number | string;
  parent_id: number | string | null;
  author_name: string;
  body: string;
  created_at: string;
};

// ── GET /api/comments?slug=… → threaded, approved comments ─────────────────────
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  try {
    const rows = (await sql`
      SELECT id, parent_id, author_name, body, created_at
      FROM comments
      WHERE post_slug = ${slug} AND approved = TRUE
      ORDER BY created_at ASC
    `) as Row[];

    // Index by id and resolve each row's top-level ancestor so replies-to-replies
    // collapse into a single thread under their root comment.
    const byId = new Map<number, Row>();
    for (const r of rows) byId.set(Number(r.id), r);

    const rootOf = (r: Row): Row => {
      let cur = r;
      const seen = new Set<number>();
      while (cur.parent_id != null && !seen.has(Number(cur.id))) {
        seen.add(Number(cur.id));
        const parent = byId.get(Number(cur.parent_id));
        if (!parent) break;
        cur = parent;
      }
      return cur;
    };

    const roots = new Map<number, CommentNode>();
    // First pass: create all root nodes
    for (const r of rows) {
      if (r.parent_id == null) {
        roots.set(Number(r.id), {
          id: Number(r.id),
          authorName: r.author_name,
          body: r.body,
          createdAt: String(r.created_at),
          replies: [],
        });
      }
    }
    // Second pass: attach replies to their root thread (already chronological)
    for (const r of rows) {
      if (r.parent_id == null) continue;
      const root = rootOf(r);
      const node = roots.get(Number(root.id));
      if (!node) continue;
      const parent = byId.get(Number(r.parent_id));
      node.replies.push({
        id: Number(r.id),
        authorName: r.author_name,
        body: r.body,
        createdAt: String(r.created_at),
        replyToName: parent ? parent.author_name : null,
      });
    }

    return NextResponse.json({ comments: [...roots.values()] });
  } catch {
    return NextResponse.json({ error: "Failed to load comments." }, { status: 500 });
  }
}

// ── POST /api/comments → create a comment or reply ─────────────────────────────
export async function POST(req: NextRequest) {
  if (isRateLimited(getIp(req))) {
    return NextResponse.json(
      { error: "Too many comments. Please try again later." },
      { status: 429 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { slug, name, email, body, parentId, _trap } = payload as {
    slug?: string;
    name?: string;
    email?: string;
    body?: string;
    parentId?: number | string | null;
    _trap?: string;
  };

  // Honeypot: bots fill hidden fields; accept silently so they think it worked.
  if (_trap) return NextResponse.json({ ok: true });

  // Only allow comments on real, published posts.
  const validSlug = getAllPostsMeta().some((p) => p.slug === slug);
  if (!slug || !validSlug) {
    return NextResponse.json({ error: "Unknown post." }, { status: 404 });
  }

  const err = validate(String(name ?? ""), String(email ?? ""), String(body ?? ""));
  if (err) return NextResponse.json({ error: err }, { status: 422 });

  let parent: number | null = null;
  if (parentId != null && parentId !== "") {
    const pid = Number(parentId);
    if (!Number.isInteger(pid)) {
      return NextResponse.json({ error: "Invalid parent comment." }, { status: 422 });
    }
    try {
      const found = (await sql`
        SELECT id FROM comments WHERE id = ${pid} AND post_slug = ${slug}
      `) as { id: number }[];
      if (found.length === 0) {
        return NextResponse.json({ error: "Parent comment not found." }, { status: 422 });
      }
      parent = pid;
    } catch {
      return NextResponse.json({ error: "Failed to post comment." }, { status: 500 });
    }
  }

  try {
    const inserted = (await sql`
      INSERT INTO comments (post_slug, parent_id, author_name, author_email, body)
      VALUES (${slug}, ${parent}, ${String(name).trim()}, ${String(email).trim()}, ${String(body).trim()})
      RETURNING id, parent_id, author_name, body, created_at
    `) as Row[];

    const row = inserted[0];
    return NextResponse.json({
      comment: {
        id: Number(row.id),
        parentId: row.parent_id == null ? null : Number(row.parent_id),
        authorName: row.author_name,
        body: row.body,
        createdAt: String(row.created_at),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to post comment." }, { status: 500 });
  }
}
