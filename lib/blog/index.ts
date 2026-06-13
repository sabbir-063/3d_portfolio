import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "./parse";
import { readTime } from "./read-time";
import type { Category } from "./categories";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

export type BlogMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  label: Category;
  tags: string[];
  cover: string;
  readMinutes: number;
  featured: boolean;
  published: boolean;
};

export type BlogPost = BlogMeta & { body: string };

let cache: BlogPost[] | null = null;

function loadAll(): BlogPost[] {
  if (cache) return cache;
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map<BlogPost>((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { meta, body } = parseFrontmatter(raw);
    const slug = (meta.slug as string) || file.replace(/\.md$/, "");

    return {
      slug,
      title: String(meta.title ?? slug),
      excerpt: String(meta.excerpt ?? ""),
      date: String(meta.date ?? ""),
      label: (meta.label as Category) ?? "Engineering Notes",
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      cover: String(meta.cover ?? ""),
      readMinutes: readTime(body),
      featured: meta.featured === true,
      published: meta.published !== false, // default true unless explicitly false
      body,
    };
  });

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = posts;
  return posts;
}

function toMeta(p: BlogPost): BlogMeta {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    label: p.label,
    tags: p.tags,
    cover: p.cover,
    readMinutes: p.readMinutes,
    featured: p.featured,
    published: p.published,
  };
}

/** All published posts. Drafts are filtered out. */
export function getAllPosts(): BlogPost[] {
  return loadAll().filter((p) => p.published);
}

export function getAllPostsMeta(): BlogMeta[] {
  return getAllPosts().map(toMeta);
}

/** Featured posts for the homepage, capped. Falls back to most recent if too few are featured. */
export function getFeaturedPostsMeta(limit = 2): BlogMeta[] {
  const all = getAllPosts();
  const featured = all.filter((p) => p.featured);
  if (featured.length >= limit) return featured.slice(0, limit).map(toMeta);
  // Fallback: pad with most-recent non-featured so the homepage never goes empty
  const filler = all.filter((p) => !p.featured).slice(0, limit - featured.length);
  return [...featured, ...filler].map(toMeta);
}

export function getPost(slug: string): BlogPost | null {
  // Allow direct-URL access to drafts (the listing page won't link them)
  return loadAll().find((p) => p.slug === slug) ?? null;
}
