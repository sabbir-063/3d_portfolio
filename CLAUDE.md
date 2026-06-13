# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # next dev (http://localhost:3000)
npm run build   # next build
npm start       # next start (production)
npm run lint    # next lint (ESLint via eslint-config-next)
```

There is no test framework configured.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS **v3** (not v4 — `tailwind.config.ts` is authoritative) · Framer Motion · GSAP + ScrollTrigger · Lenis smooth scroll · Resend (email).

Path alias `@/*` maps to the repo root (see `tsconfig.json`).

## Architecture

### Page composition pattern
`app/page.tsx` is just a vertical stack of section components imported from `components/<section>/`. Each section directory is self-contained: the section component, its sub-components, and a co-located `*Data.ts` file holding the content. To change site content (projects, skills, technologies, services, reflections, about info), edit the `*Data.ts` file — not the component.

Routes other than home:
- `app/projects/page.tsx` — full project archive
- `app/blog/page.tsx` — blog index
- `app/blog/[slug]/page.tsx` — individual post (uses `generateStaticParams` so all published posts are statically generated at build)
- `app/api/contact/route.ts` — contact form POST handler

### Blog system (custom, no MDX/remark)
Markdown posts live in `content/blog/*.md`. The pipeline is hand-rolled:

- `lib/blog/parse.ts` — **custom frontmatter parser**. Supports strings, `["a","b"]` arrays, and booleans only. No YAML library.
- `lib/blog/render.tsx` — **custom Markdown-to-JSX renderer**. Only supports: `## h2`, `### h3`, `p`, `- ul`, `1. ol`, `> quote`, fenced code, `---` hr, and inline `[link](url)`, `` `code` ``, `**bold**`, `*italic*`. Anything else (tables, images, HTML, footnotes) will not render. Extend `tokenize`/`inline` in this file if you need more.
- `lib/blog/index.ts` — loads/caches all posts, exposes `getAllPosts`, `getAllPostsMeta`, `getFeaturedPostsMeta`, `getPost`. Sort is by `date` string descending. Filters `published: false` from listings but `getPost(slug)` still returns drafts (direct URL works).
- Frontmatter contract: `title`, `slug`, `excerpt`, `date`, `label` (a `Category` from `lib/blog/categories.ts`), `tags`, `cover`, `featured`, `published`. `published` defaults to `true` unless explicitly `false`.

The homepage shows `HOMEPAGE_BLOG_LIMIT = 2` featured posts, padded with most-recent if fewer than 2 are flagged featured.

### Theming
Light/dark uses CSS custom properties in `styles/globals.css` written in **space-separated RGB** (e.g. `--color-primary: 88 70 160`) so Tailwind's opacity modifiers (`bg-primary/30`) work in both modes. Tailwind config wires these via `rgb(var(--color-x) / <alpha-value>)`.

Dark mode is `darkMode: "class"`. The `dark` class is set on `<html>` by an inline `beforeInteractive` script in `app/layout.tsx` (reads `localStorage.theme`, falls back to `prefers-color-scheme`). The script must remain inline pre-hydration to prevent a flash; `suppressHydrationWarning` is set on `<html>` and `<body>` because of this.

There are also many static Material 3-style color tokens defined directly in `tailwind.config.ts` (non-themeable, dark-leaning). Theme-variable colors and static tokens coexist intentionally.

### Animations
`lib/gsap.ts` is the GSAP singleton — it registers `ScrollTrigger` only when `window` exists. Always import GSAP and ScrollTrigger from `@/lib/gsap`, never directly from `gsap`, so the plugin registration runs exactly once and stays SSR-safe.

Smooth scroll is provided by `<SmoothScroll>` (Lenis) wrapping all content in the root layout.

### Contact form
`app/api/contact/route.ts` uses Resend. Env vars required: `RESEND_API_KEY`, `CONTACT_EMAIL`. Anti-abuse:
- In-memory rate limit: 3 submissions per IP per hour (resets on cold start — acceptable for this site).
- Honeypot field `_trap`: if filled, returns 200 silently.
- URL pattern in `name` or `message` is rejected as spam.

### SEO / metadata
`SITE_URL = "https://sabbirmusfique.com.bd"` is hardcoded in multiple files (`app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/blog/[slug]/page.tsx`). Update all of them together if the domain changes.

`app/opengraph-image.tsx` generates the 1200×630 OG image; the global `metadata.openGraph` in `app/layout.tsx` intentionally omits `images` and lets Next.js pick this up.

### Images
Remote image hosts must be whitelisted in `next.config.ts` under `images.remotePatterns`. Currently allowed: `lh3.googleusercontent.com`, `images.unsplash.com`, `picsum.photos`.

## Deployment
Vercel, framework pinned to `nextjs` via `vercel.json`. Push to `main` deploys.
