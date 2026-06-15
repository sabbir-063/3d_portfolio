"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BlogCard from "@/components/blogs/BlogCard";
import { categories, type Category } from "@/lib/blog/categories";
import type { BlogMeta } from "@/lib/blog";

const PAGE_SIZE = 5;

type SortMode = "newest" | "oldest" | "category";
type Filter = Category | "All";

const CATEGORY_KEYS = Object.keys(categories) as Category[];

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "category", label: "Category A–Z" },
];

export default function BlogListing({ posts }: { posts: BlogMeta[] }) {
  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Filter>("All");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Debounce the search input (~150ms)
  useEffect(() => {
    const id = setTimeout(() => setQuery(rawQuery.trim().toLowerCase()), 150);
    return () => clearTimeout(id);
  }, [rawQuery]);

  const filtered = useMemo(() => {
    let result = posts;

    if (activeCategory !== "All") {
      result = result.filter((p) => p.label === activeCategory);
    }

    if (query) {
      result = result.filter((p) => {
        const haystack = [p.title, p.excerpt, ...p.tags].join(" ").toLowerCase();
        return haystack.includes(query);
      });
    }

    // posts arrive date-desc from the lib; clone before sorting
    const sorted = [...result];
    if (sortMode === "oldest") {
      sorted.sort((a, b) => (a.date < b.date ? -1 : 1));
    } else if (sortMode === "category") {
      sorted.sort((a, b) => a.label.localeCompare(b.label) || (a.date < b.date ? 1 : -1));
    } else {
      sorted.sort((a, b) => (a.date < b.date ? 1 : -1));
    }

    return sorted;
  }, [posts, activeCategory, query, sortMode]);

  // Restart pagination whenever the result set changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, activeCategory, sortMode]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Infinite scroll: reveal PAGE_SIZE more when the sentinel enters view
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => c + PAGE_SIZE);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, filtered.length]);

  return (
    <div className="flex flex-col gap-8">
      {/* Controls */}
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant/60 pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={rawQuery}
            onChange={(e) => setRawQuery(e.target.value)}
            placeholder="Search posts, keywords, tags…"
            aria-label="Search posts"
            className="glass-panel w-full rounded-full border border-black/[0.08] dark:border-white/10 pl-11 pr-10 py-2.5 text-sm font-body text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-tertiary/50 transition-colors"
          />
          {rawQuery && (
            <button
              type="button"
              onClick={() => setRawQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Category chips + sort */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <CategoryChip
              label="All"
              active={activeCategory === "All"}
              onClick={() => setActiveCategory("All")}
            />
            {CATEGORY_KEYS.map((key) => (
              <CategoryChip
                key={key}
                label={key}
                active={activeCategory === key}
                accent={categories[key].accent}
                dot={categories[key].dot}
                onClick={() => setActiveCategory(key)}
              />
            ))}
          </div>

          <label className="flex items-center gap-2 text-[10px] font-label uppercase tracking-wider text-on-surface-variant">
            Sort
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              aria-label="Sort posts"
              className="glass-panel rounded-full border border-black/[0.08] dark:border-white/10 px-3 py-1.5 text-xs font-body normal-case tracking-normal text-on-surface outline-none focus:border-tertiary/50 transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">
            search_off
          </span>
          <p className="text-on-surface-variant text-sm mt-4 font-body">
            No posts match your search.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {visible.map((post, i) => (
              <BlogCard key={post.slug} {...post} index={i} />
            ))}
          </div>

          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-6">
              <span className="material-symbols-outlined animate-spin text-on-surface-variant/40 text-2xl">
                progress_activity
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CategoryChip({
  label,
  active,
  accent,
  dot,
  onClick,
}: {
  label: string;
  active: boolean;
  accent?: string;
  dot?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold font-label uppercase tracking-wider transition-all glass-panel ${
        active
          ? `border-tertiary/40 ${accent ?? "text-tertiary"}`
          : "border-black/[0.08] dark:border-white/10 text-on-surface-variant hover:text-on-surface"
      }`}
    >
      {dot && <span className={`w-1 h-1 rounded-full ${active ? dot : "bg-on-surface-variant/40"}`} />}
      {label}
    </button>
  );
}
