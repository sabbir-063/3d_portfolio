"use client";

import Image from "next/image";
import { useState } from "react";
import type { Reflection } from "./reflectionData";

const COLLAPSE_THRESHOLD = 300;

interface ReflectionCardProps extends Reflection {
  onExpandedChange?: (id: number, expanded: boolean) => void;
}

export default function ReflectionCard({
  id,
  comment,
  name,
  designation,
  company,
  formerly,
  photo,
  initials,
  onExpandedChange,
}: ReflectionCardProps) {
  const isLong = comment.length > COLLAPSE_THRESHOLD;
  const [expanded, setExpanded] = useState(false);
  const clamped = isLong && !expanded;

  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);
    onExpandedChange?.(id, next);
  };

  return (
    <article className="glass-panel rounded-2xl p-7 md:p-9 lg:p-10 flex flex-col gap-7 relative">
      <span
        aria-hidden="true"
        className="absolute top-6 right-7 md:top-7 md:right-8 font-serif text-[28px] leading-none text-secondary/25 select-none pointer-events-none"
      >
        &ldquo;
      </span>

      <div className="flex flex-col gap-3">
        <p
          className={`text-on-surface/85 text-[15px] md:text-[15.5px] leading-[1.8] font-body tracking-[0.005em] ${
            clamped ? "line-clamp-5" : ""
          }`}
        >
          {comment}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={expanded}
            className="self-start inline-flex items-center gap-1 mt-1 text-[12px] font-medium font-headline tracking-wide text-secondary/80 hover:text-secondary transition-colors"
          >
            {expanded ? "Show less" : "Continue reading"}
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[15px] leading-none"
            >
              {expanded ? "expand_less" : "expand_more"}
            </span>
          </button>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-on-surface/[0.08] via-on-surface/[0.04] to-transparent" />

      <footer className="flex items-center gap-4">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            width={44}
            height={44}
            className="w-11 h-11 rounded-full object-cover ring-1 ring-on-surface/10 shrink-0"
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-11 h-11 rounded-full glass-panel ring-1 ring-secondary/20 flex items-center justify-center text-[11px] font-semibold font-headline tracking-[0.08em] text-secondary shrink-0"
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-on-surface text-[14px] font-semibold font-headline leading-tight">
            {name}
          </p>
          <p className="text-on-surface-variant/85 text-[12px] font-body leading-snug mt-1">
            {designation}
            <span className="opacity-30 mx-2">·</span>
            {formerly && <span className="italic opacity-75">formerly at </span>}
            {company}
          </p>
        </div>
      </footer>
    </article>
  );
}
