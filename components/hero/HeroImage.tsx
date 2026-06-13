"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ── Card height shared between both cards ──────────────────────────────────────
const CARD_H = 360; // px — change here to resize both

// ── Snippets — cycle one by one ───────────────────────────────────────────────
const SNIPPETS: Array<Array<{ text: string; col: string }>> = [
  [
    { text: "// that one bug at 2am", col: "#4b5563" },
    { text: "", col: "" },
    { text: "const db = await connect();", col: "#c7b9f5" },
    { text: "// seemed fine.", col: "#4b5563" },
    { text: "// wasn't fine.", col: "#4b5563" },
    { text: "", col: "" },
    { text: "db.on('error', () => {", col: "#c7b9f5" },
    { text: "  destroy();", col: "#ff6b8a" },
    { text: "  reconnect(); // always", col: "#7bcf7b" },
    { text: "});", col: "#c7b9f5" },
    { text: "", col: "" },
    { text: "// assume failure. always.", col: "#4b5563" },
  ],
  [
    { text: "// things I learned the hard way", col: "#4b5563" },
    { text: "", col: "" },
    { text: "if (!understood(requirements)) {", col: "#c7b9f5" },
    { text: "  doNotCode(); // seriously", col: "#ff6b8a" },
    { text: "}", col: "#c7b9f5" },
    { text: "", col: "" },
    { text: "breakInto(smallComponents);", col: "#7bcf7b" },
    { text: "thinkLike(user);", col: "#6ab0f5" },
    { text: "stayFlexible(", col: "#c9e8ee" },
    { text: "  clientWillChangeIt()", col: "#c9e8ee" },
    { text: ");", col: "#c9e8ee" },
    { text: "", col: "" },
    { text: "// they always change it.", col: "#4b5563" },
  ],
  [
    { text: "// a normal day", col: "#4b5563" },
    { text: "", col: "" },
    { text: "drinkCoffee();", col: "#c9e8ee" },
    { text: "readRequirements();", col: "#7bcf7b" },
    { text: "writeCode();", col: "#6ab0f5" },
    { text: "readRequirements(); // again", col: "#7bcf7b" },
    { text: "rewriteCode();", col: "#c7b9f5" },
    { text: "fixThatOneBug();", col: "#ff6b8a" },
    { text: "ship();", col: "#7bcf7b" },
    { text: "sleep(); // sometimes", col: "#4b5563" },
    { text: "", col: "" },
    { text: "// repeat ∞", col: "#4b5563" },
  ],
  [
    { text: "// debugging, honestly", col: "#4b5563" },
    { text: "", col: "" },
    { text: "const solve = (bug) =>", col: "#c7b9f5" },
    { text: "  readTheLogs()", col: "#e8e8e8" },
    { text: "    ?? checkTheAssumption()", col: "#c9e8ee" },
    { text: "    ?? google(exactError)", col: "#7bcf7b" },
    { text: "    ?? rubberDuck.explain()", col: "#6ab0f5" },
    { text: "    ?? fix();", col: "#ff6b8a" },
    { text: "", col: "" },
    { text: "// the assumption was wrong.", col: "#4b5563" },
    { text: "// it's always the assumption.", col: "#4b5563" },
  ],
];

// ── Live-typing terminal ───────────────────────────────────────────────────────
function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px" });
  const [snippet, setSnippet] = useState(0);
  const [lines, setLines] = useState(0);
  const [chars, setChars] = useState(0);

  const active = SNIPPETS[snippet];

  useEffect(() => {
    if (!inView) return;

    const line = active[lines] ?? active[active.length - 1];
    if (chars < line.text.length) {
      const t = setTimeout(
        () => setChars((c) => c + 1),
        22 + Math.random() * 22,
      );
      return () => clearTimeout(t);
    }
    const isLast = lines >= active.length - 1;
    const t = setTimeout(() => {
      if (isLast) {
        // pause, then move to next snippet
        setTimeout(() => {
          setSnippet((s) => (s + 1) % SNIPPETS.length);
          setLines(0);
          setChars(0);
        }, 2400);
      } else {
        setLines((l) => l + 1);
        setChars(0);
      }
    }, 65);
    return () => clearTimeout(t);
  }, [lines, chars, snippet, active, inView]);

  const currentLine = Math.min(lines, active.length - 1);

  return (
    <motion.div
      ref={ref}
      initial={{ y: 24 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: CARD_H,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        background: "var(--terminal-bg)",
        border: "1px solid var(--terminal-border)",
        boxShadow: "var(--terminal-shadow)",
      }}
      className="rounded-2xl overflow-hidden flex-1 min-w-0 hidden md:flex flex-col"
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]/80" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]/80" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]/80" />
        <span className="ml-auto text-[10px] font-mono text-white/25 tracking-widest">
          build.ts
        </span>
      </div>

      {/* Code body — overflow-hidden locks height */}
      <div className="p-5 font-mono text-[12.5px] leading-[2] flex-1 overflow-hidden">
        {active.slice(0, lines).map((l, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-white/15 select-none text-right flex-shrink-0 w-3">
              {i + 1}
            </span>
            <span style={{ color: l.col || "transparent" }}>
              {l.text || "\u00A0"}
            </span>
          </div>
        ))}
        {lines < active.length && (
          <div className="flex gap-3">
            <span className="text-white/15 select-none text-right flex-shrink-0 w-3">
              {currentLine + 1}
            </span>
            <span style={{ color: active[currentLine].col }}>
              {active[currentLine].text.slice(0, chars)}
              <motion.span
                animate={inView ? { opacity: [1, 0] } : { opacity: 1 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="inline-block w-[6px] h-[13px] bg-current align-middle ml-px"
              />
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Photo card ─────────────────────────────────────────────────────────────────
function PhotoCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px" });

  return (
    <motion.div
      ref={ref}
      animate={inView ? { y: [0, -10, 0] } : { y: 0 }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        height: CARD_H,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        background: "var(--photo-card-bg)",
        border: "1px solid var(--photo-card-border)",
        boxShadow: "var(--photo-card-shadow)",
      }}
      className="rounded-3xl p-4 flex flex-col gap-3 w-[280px] lg:w-[210px] flex-shrink-0"
    >
      {/* Photo — flex-1 fills remaining height */}
      <div className="relative rounded-2xl overflow-hidden flex-1">
        <Image
          src="/sabbir_musfique.png"
          alt="Mohammad Sabbir Musfique"
          fill
          sizes="200px"
          className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000"
          priority
        />

        {/* Scan sweep */}
        <motion.div
          animate={inView ? { top: ["-4%", "106%"] } : { top: "-4%" }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            repeatDelay: 2.5,
            ease: "linear",
          }}
          className="absolute left-0 right-0 h-[3px] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent 10%, rgb(var(--color-secondary) / 0.9) 50%, transparent 90%)",
            boxShadow: "0 0 14px 4px rgb(var(--color-secondary) / 0.5)",
          }}
        />

        {/* HUD corners */}
        {(
          [
            "top-2.5 left-2.5 border-t-2 border-l-2",
            "top-2.5 right-2.5 border-t-2 border-r-2",
            "bottom-2.5 left-2.5 border-b-2 border-l-2",
            "bottom-2.5 right-2.5 border-b-2 border-r-2",
          ] as const
        ).map((cls, i) => (
          <div
            key={i}
            className={`absolute w-5 h-5 ${cls} border-secondary/75`}
          />
        ))}

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "var(--photo-bottom-fade)" }}
        />
      </div>

      {/* Identity */}
      <div className="px-1 flex-shrink-0">
        <p className="text-[12px] font-bold font-headline text-on-surface leading-snug">
          Mohammad Sabbir Musfique
        </p>
        <p className="text-[10px] font-label text-primary dark:text-secondary mt-0.5 tracking-wide">
          Software Engineer
        </p>
      </div>

      {/* Stats */}
      <div
        className="flex items-center justify-between px-1 pt-2.5 pb-0.5 flex-shrink-0"
        style={{ borderTop: "1px solid var(--glass-border)" }}
      >
        <div className="text-center">
          <p className="text-sm font-bold font-headline text-primary leading-none">
            1+
          </p>
          <p className="text-[8px] text-on-surface-variant font-label uppercase tracking-wider mt-1">
            Yrs
          </p>
        </div>
        <div className="w-px h-5 bg-black/10 dark:bg-white/10" />
        <div className="text-center">
          <p className="text-sm font-bold font-headline text-primary leading-none">
            5+
          </p>
          <p className="text-[8px] text-on-surface-variant font-label uppercase tracking-wider mt-1">
            Projects
          </p>
        </div>
        <div className="w-px h-5 bg-black/10 dark:bg-white/10" />
        <div className="text-center">
          <motion.p
            animate={inView ? { opacity: [1, 0.15, 1] } : { opacity: 1 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="text-sm text-emerald-400 font-bold leading-none"
          >
            ●
          </motion.p>
          <p className="text-[8px] text-on-surface-variant font-label uppercase tracking-wider mt-1">
            Live
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function HeroImage() {
  return (
    <motion.div
      initial={{ x: 30 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex justify-start lg:justify-end"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 55% 50%, rgba(199,185,245,0.1) 0%, transparent 65%)",
          filter: "blur(30px)",
        }}
      />

      <div className="relative flex items-start gap-4 w-full max-w-[520px]">
        <PhotoCard />
        <Terminal />
      </div>
    </motion.div>
  );
}
