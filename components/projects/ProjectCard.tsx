"use client";

import { useMotionValue, useSpring, useTransform, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal, BrandIcon } from "@/components/ui";
import type { Project } from "./projectData";

const statusConfig: Record<
  Project["status"],
  { label: string; text: string; dot: string }
> = {
  Production:       { label: "Live",        text: "text-emerald-500 dark:text-emerald-400", dot: "bg-emerald-500 dark:bg-emerald-400" },
  "Open Source":    { label: "Open Source", text: "text-primary",                           dot: "bg-primary" },
  "In Development": { label: "In Progress", text: "text-amber-500 dark:text-amber-400",     dot: "bg-amber-500 dark:bg-amber-400" },
  Archived:         { label: "Archived",    text: "text-on-surface-variant",                dot: "bg-on-surface-variant" },
};

export default function ProjectCard({
  title,
  description,
  gitUrl,
  liveUrl,
  image,
  tags,
  status,
  index,
}: Project & { index: number }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 32 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-3, 3]), { stiffness: 200, damping: 32 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  const sc = statusConfig[status];

  return (
    <ScrollReveal direction="up" delay={index * 0.12} amount={0.08}>
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onMouseMove={onMove}
        onMouseLeave={() => { mx.set(0); my.set(0); }}
        className="group relative glass-panel glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full"
      >
        {/* Image */}
        <div className="relative h-52 flex-shrink-0 overflow-hidden rounded-t-2xl">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            loading={index === 0 ? "eager" : "lazy"}
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
          {/* Gradient bleed into content area */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/10 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-3.5 right-3.5">
            <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.13em] uppercase bg-surface/80 backdrop-blur-md border border-black/[0.1] dark:border-white/[0.12] px-2.5 py-[5px] rounded-full ${sc.text}`}>
              <span className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${sc.dot}`} />
              {sc.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-5 pb-5 pt-3 gap-3">
          <h3 className="text-[1.05rem] font-bold font-headline tracking-tight leading-snug text-on-surface group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>

          <p className="text-[0.8125rem] text-on-surface-variant leading-relaxed line-clamp-3 font-body">
            {description}
          </p>

          {/* Tags — deemphasized metadata */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-auto pt-1">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] font-mono text-on-surface-variant/50 tracking-wide">
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3.5 border-t border-black/[0.07] dark:border-white/[0.06]">
            <Link
              href={gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-black/[0.1] dark:border-white/[0.12] bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] hover:border-black/[0.18] dark:hover:border-white/[0.24] active:scale-[0.97] transition-all text-[11px] font-bold font-headline text-on-surface-variant hover:text-on-surface dark:hover:text-white group/btn"
            >
              <BrandIcon name="github" className="w-3.5 h-3.5 group-hover/btn:text-primary transition-colors" />
              GitHub
            </Link>

            <Link
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-primary/[0.25] bg-primary/[0.1] hover:bg-primary/[0.2] hover:border-primary/[0.45] active:scale-[0.97] transition-all text-[11px] font-bold font-headline text-primary group/btn"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0 group-hover/btn:rotate-45 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Live Site
            </Link>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}
