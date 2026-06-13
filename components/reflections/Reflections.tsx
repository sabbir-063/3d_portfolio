"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ScrollReveal, SectionHeading } from "@/components/ui";
import { reflections } from "./reflectionData";
import ReflectionCard from "./ReflectionCard";

const AUTO_ROTATE_MS = 5000;
const DESKTOP_WINDOW = 2;
const total = reflections.length;

const cardTransition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] };

const cardVariants = {
  enter: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: cardTransition },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.4, ease: [0.55, 0, 0.78, 0] },
  },
};

export default function Reflections() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "200px" });
  const [tabVisible, setTabVisible] = useState(true);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set());

  const next = useCallback(() => setActive((a) => (a + 1) % total), []);
  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), []);

  const handleExpandedChange = useCallback((id: number, expanded: boolean) => {
    setExpandedIds((prev) => {
      const updated = new Set(prev);
      if (expanded) updated.add(id);
      else updated.delete(id);
      return updated;
    });
  }, []);

  // Track tab visibility — don't rotate cards while the user is on another tab
  useEffect(() => {
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Any manual page change drops the "reading" state — the expanded card unmounts anyway
  useEffect(() => {
    setExpandedIds(new Set());
  }, [active]);

  const isReading = expandedIds.size > 0;

  useEffect(() => {
    if (paused || isReading || !inView || !tabVisible) return;
    const id = setInterval(next, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, isReading, inView, tabVisible, next]);

  const desktopItems = Array.from(
    { length: DESKTOP_WINDOW },
    (_, i) => reflections[(active + i) % total]
  );
  const mobileItem = reflections[active];

  return (
    <section
      ref={sectionRef}
      id="Reflections"
      className="py-32 md:py-40 px-6 md:px-16 lg:px-24 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal direction="up">
          <SectionHeading
            accent="Reflections"
            accentClassName="text-secondary text-glow"
            subtitle="A few words from people I’ve built things with."
            dividerColor="from-secondary"
          />
        </ScrollReveal>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="mt-14 md:mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* Desktop — 2 cards, rotating one at a time */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-8 items-start">
              <AnimatePresence mode="popLayout" initial={false}>
                {desktopItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={cardVariants}
                    initial="enter"
                    animate="visible"
                    exit="exit"
                  >
                    <ReflectionCard
                      {...item}
                      onExpandedChange={handleExpandedChange}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile — single card */}
          <div className="md:hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`mobile-${mobileItem.id}`}
                variants={cardVariants}
                initial="enter"
                animate="visible"
                exit="exit"
              >
                <ReflectionCard
                  {...mobileItem}
                  onExpandedChange={handleExpandedChange}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation — fractional indicator + chevrons */}
          <div className="flex items-center justify-center gap-7 mt-12">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous reflection"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant/60 hover:text-on-surface hover:bg-on-surface/[0.05] transition-colors duration-300"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
            </button>
            <div
              className="font-mono text-[11px] tracking-[0.3em] text-on-surface-variant/70 tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {String(active + 1).padStart(2, "0")}
              <span className="opacity-25 mx-2.5">/</span>
              {String(total).padStart(2, "0")}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Next reflection"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant/60 hover:text-on-surface hover:bg-on-surface/[0.05] transition-colors duration-300"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
