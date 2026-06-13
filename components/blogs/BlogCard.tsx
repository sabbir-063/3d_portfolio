"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal, TagPill } from "@/components/ui";
import { categories } from "@/lib/blog/categories";
import type { BlogMeta } from "@/lib/blog";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  cover,
  date,
  readMinutes,
  label,
  tags,
  index,
}: BlogMeta & { index: number }) {
  const imageRight = index % 2 !== 0;
  const cat = categories[label] ?? categories["Engineering Notes"];

  return (
    <ScrollReveal direction="up" delay={index * 0.08} amount={0.1}>
      <Link
        href={`/blog/${slug}`}
        className={`glass-panel rounded-2xl overflow-hidden glass-card-hover group flex flex-col sm:flex-row h-full ${imageRight ? "sm:flex-row-reverse" : ""}`}
      >
        {/* Image — clean, no overlay badge */}
        <div className="relative h-52 sm:h-auto sm:w-72 lg:w-80 flex-shrink-0 overflow-hidden">
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
          <div className={`absolute inset-0 bg-gradient-to-${imageRight ? "l" : "r"} from-transparent via-transparent to-surface/60 hidden sm:block`} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/70 via-transparent to-transparent sm:hidden" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center gap-3 p-6 flex-1 min-w-0">
          {/* Kicker — category as editorial label, sits above title */}
          <div className="flex items-center gap-2">
            <span className={`w-1 h-1 rounded-full ${cat.dot}`} />
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase font-label ${cat.accent}`}>
              {label}
            </span>
          </div>

          <h3 className={`text-lg font-bold tracking-tight font-headline leading-snug text-on-surface ${cat.groupHover} transition-colors`}>
            {title}
          </h3>

          <p className="text-on-surface-variant text-xs leading-relaxed font-body line-clamp-3">
            {excerpt}
          </p>

          {/* Meta row — date + computed read time only */}
          <div className="flex items-center gap-3 text-[10px] text-on-surface-variant font-label">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">calendar_today</span>
              {formatDate(date)}
            </span>
            <span className="w-1 h-1 rounded-full bg-on-surface-variant/30" />
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              {readMinutes} min read
            </span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => <TagPill key={tag} label={tag} />)}
            </div>
          )}

          <span className={`inline-flex items-center gap-1.5 text-xs font-bold font-headline ${cat.accent} group-hover:gap-3 transition-all w-fit mt-1`}>
            Read Post
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </span>
        </div>
      </Link>
    </ScrollReveal>
  );
}
