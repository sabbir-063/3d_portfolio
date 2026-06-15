"use client";

import { useCallback, useEffect, useState } from "react";

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

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function countAll(comments: CommentNode[]): number {
  return comments.reduce((n, c) => n + 1 + c.replies.length, 0);
}

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeReply, setActiveReply] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setComments(data.comments ?? []);
      setLoadError(null);
    } catch {
      setLoadError("Couldn't load comments.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const total = countAll(comments);

  return (
    <section className="mt-16 pt-8 border-t border-black/[0.08] dark:border-white/[0.08]">
      <h2 className="text-lg font-bold font-headline tracking-tight text-on-surface mb-1">
        Comments {total > 0 && <span className="text-on-surface-variant font-normal">({total})</span>}
      </h2>
      <p className="text-on-surface-variant text-xs font-body mb-8">
        Join the discussion. Your email is never shown publicly.
      </p>

      {/* Top-level form */}
      <CommentForm slug={slug} onSuccess={load} />

      {/* Thread */}
      <div className="mt-10 flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="material-symbols-outlined animate-spin text-on-surface-variant/40 text-2xl">
              progress_activity
            </span>
          </div>
        ) : loadError ? (
          <p className="text-on-surface-variant text-sm font-body">{loadError}</p>
        ) : comments.length === 0 ? (
          <p className="text-on-surface-variant text-sm font-body">
            No comments yet — be the first to share your thoughts.
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="glass-panel rounded-2xl p-5">
              <CommentBody
                authorName={c.authorName}
                body={c.body}
                createdAt={c.createdAt}
              />

              {/* Replies */}
              {c.replies.length > 0 && (
                <div className="mt-4 ml-4 sm:ml-6 pl-4 sm:pl-5 border-l border-black/[0.08] dark:border-white/[0.08] flex flex-col gap-4">
                  {c.replies.map((r) => (
                    <CommentBody
                      key={r.id}
                      authorName={r.authorName}
                      body={r.body}
                      createdAt={r.createdAt}
                      replyToName={r.replyToName}
                    />
                  ))}
                </div>
              )}

              {/* Reply control */}
              <div className="mt-4">
                {activeReply === c.id ? (
                  <CommentForm
                    slug={slug}
                    parentId={c.id}
                    compact
                    onSuccess={() => {
                      setActiveReply(null);
                      load();
                    }}
                    onCancel={() => setActiveReply(null)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveReply(c.id)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold font-label uppercase tracking-wider text-on-surface-variant hover:text-tertiary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">reply</span>
                    Reply
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function CommentBody({
  authorName,
  body,
  createdAt,
  replyToName,
}: {
  authorName: string;
  body: string;
  createdAt: string;
  replyToName?: string | null;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-9 h-9 rounded-full glass-panel flex items-center justify-center text-[11px] font-bold font-label text-tertiary">
        {initials(authorName) || "?"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-bold font-headline text-on-surface">{authorName}</span>
          {replyToName && (
            <span className="text-[11px] text-on-surface-variant font-body">
              replying to <span className="text-tertiary">{replyToName}</span>
            </span>
          )}
          <span className="text-[10px] text-on-surface-variant/70 font-label">
            {formatDate(createdAt)}
          </span>
        </div>
        <p className="text-on-surface-variant text-sm leading-relaxed font-body mt-1 whitespace-pre-wrap break-words">
          {body}
        </p>
      </div>
    </div>
  );
}

function CommentForm({
  slug,
  parentId,
  compact,
  onSuccess,
  onCancel,
}: {
  slug: string;
  parentId?: number;
  compact?: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [trap, setTrap] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputCls =
    "glass-panel w-full rounded-xl border border-black/[0.08] dark:border-white/10 px-3.5 py-2.5 text-sm font-body text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-tertiary/50 transition-colors";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, email, body, parentId, _trap: trap }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setName("");
      setEmail("");
      setBody("");
      onSuccess();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "flex flex-col gap-2.5" : "flex flex-col gap-3"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          aria-label="Your name"
          maxLength={80}
          required
          className={inputCls}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (not shown publicly)"
          aria-label="Your email"
          required
          className={inputCls}
        />
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={parentId ? "Write a reply…" : "Share your thoughts…"}
        aria-label="Comment"
        rows={compact ? 2 : 3}
        maxLength={3000}
        required
        className={`${inputCls} resize-y`}
      />

      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {error && <p className="text-xs text-red-400 font-body">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 rounded-full bg-tertiary/15 border border-tertiary/30 px-4 py-2 text-xs font-bold font-headline text-tertiary hover:bg-tertiary/25 transition-colors disabled:opacity-50"
        >
          {submitting && (
            <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
          )}
          {parentId ? "Post reply" : "Post comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-[11px] font-bold font-label uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
