import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPostsMeta, getPost } from "@/lib/blog";
import { categories } from "@/lib/blog/categories";
import MarkdownContent from "@/lib/blog/render";
import { TagPill, AnimatedBlob } from "@/components/ui";

const SITE_URL = "https://sabbirmusfique.com.bd";

export function generateStaticParams() {
  return getAllPostsMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      authors: ["Mohammad Sabbir Musfique"],
      tags: post.tags,
      images: post.cover ? [post.cover] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

function formatLongDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const cat = categories[post.label];

  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover ? `${SITE_URL}${post.cover}` : undefined,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags.join(", "),
    articleSection: post.label,
    inLanguage: "en",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Person",
      name: "Mohammad Sabbir Musfique",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Mohammad Sabbir Musfique",
      url: SITE_URL,
    },
  };

  return (
    <main className="relative z-10 min-h-screen pt-32 pb-28 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnimatedBlob color="bg-tertiary" size="w-[400px] h-[400px]" position="top-[5%] -right-[8%]" duration={14} />
      <AnimatedBlob color="bg-primary" size="w-[260px] h-[260px]" position="bottom-[15%] -left-[5%]" duration={11} delay={2} />

      <article className="relative z-10 max-w-3xl mx-auto px-6 md:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface font-label uppercase tracking-[0.18em] mb-12 transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          All Posts
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <span className={`w-1 h-1 rounded-full ${cat.dot}`} />
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase font-label ${cat.accent}`}>
              {post.label}
            </span>
          </div>

          <h1 className="text-3xl md:text-[2.75rem] font-bold font-headline tracking-tight text-on-surface leading-[1.15]">
            {post.title}
          </h1>

          <p className="text-on-surface-variant mt-5 text-base font-body leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 mt-7 text-[11px] text-on-surface-variant font-label">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px]">calendar_today</span>
              {formatLongDate(post.date)}
            </span>
            <span className="w-1 h-1 rounded-full bg-on-surface-variant/30" />
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px]">schedule</span>
              {post.readMinutes} min read
            </span>
          </div>
        </header>

        {post.cover && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 glass-panel">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <MarkdownContent source={post.body} />

        {post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-black/[0.08] dark:border-white/[0.08]">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase font-label text-on-surface-variant mb-3">
              Tagged
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <TagPill key={t} label={t} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 pt-8 border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface font-label uppercase tracking-[0.18em] transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            All Posts
          </Link>
          <Link
            href="/#Contact"
            className={`inline-flex items-center gap-1.5 text-xs font-bold font-headline ${cat.accent} hover:gap-3 transition-all`}
          >
            Get in touch
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </Link>
        </div>
      </article>
    </main>
  );
}
