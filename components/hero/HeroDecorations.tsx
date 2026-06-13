"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ╔══════════════════════════════════════════════════════════════╗
// ║              DECORATION CONFIG — tweak here                 ║
// ╚══════════════════════════════════════════════════════════════╝
const CONFIG = {
  // ↓↓ SPEED — lower number = faster, higher number = slower ↓↓
  speed: {
    long:     8,    // main side traces  (left / right)
    medium:   7,    // top / bottom traces
    short:    6,    // diagonal connector traces
  },

  // Opacity of the glowing pulse dot (0–1)
  pulseOpacity: {
    purple:   0.70,
    teal:     0.65,
    lavender: 0.55,
  },

  // Opacity of the static dim trace line underneath (0–1)
  traceOpacity: 0.18,

  // Width of the traveling pulse stroke (multiplier on base strokeWidth)
  pulseWidth: 1.2,

  // Length of the glowing dash in SVG units
  dashLen: 24,

  // Glow blur radius (px)
  glowBlur: 3,

  // Floating code glyph animation drift (px up/down)
  glyphDrift: 14,
};
// ══════════════════════════════════════════════════════════════════

const P  = (o: number) => `rgb(var(--color-primary) / ${o})`;
const T  = (o: number) => `rgb(var(--color-secondary) / ${o})`;
const L  = (o: number) => `rgb(var(--color-tertiary) / ${o})`;

// ── Circuit trace pulse ───────────────────────────────────────────────────────
function TracePulse({
  d,
  color,
  duration,
  delay = 0,
  pathLen = 600,
  strokeWidth = 1,
}: {
  d: string;
  color: string;
  duration: number;
  delay?: number;
  pathLen?: number;
  strokeWidth?: number;
}) {
  const dash = CONFIG.dashLen;
  const gap  = pathLen + dash + 20;
  return (
    <g>
      <path d={d} style={{ stroke: color }} strokeWidth={strokeWidth * 0.6} fill="none" opacity={CONFIG.traceOpacity} />
      <motion.path
        d={d}
        strokeWidth={strokeWidth * CONFIG.pulseWidth}
        fill="none"
        strokeLinecap="round"
        style={{
          stroke: color,
          filter: `drop-shadow(0 0 ${CONFIG.glowBlur}px ${color})`,
          strokeDasharray: `${dash} ${gap}`,
        }}
        animate={{ strokeDashoffset: [gap, -dash] }}
        transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
      />
    </g>
  );
}

// ── Floating code glyph ───────────────────────────────────────────────────────
function CodeGlyph({
  text, color, delay, drift = 14,
}: {
  text: string; color: string; delay: number; drift?: number;
}) {
  return (
    <motion.span
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 11,
        color,
        letterSpacing: "0.04em",
        userSelect: "none",
        display: "block",
        filter: `drop-shadow(0 0 6px ${color})`,
      }}
      animate={{ y: [0, -drift, 0], opacity: [0.4, 0.85, 0.4] }}
      transition={{ duration: 4 + delay * 0.4, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      {text}
    </motion.span>
  );
}

// ── HUD corner label ──────────────────────────────────────────────────────────
function HudLabel({
  lines, color, align = "left",
}: {
  lines: string[]; color: string; align?: "left" | "right";
}) {
  return (
    <div style={{ textAlign: align }}>
      {lines.map((line, i) => (
        <motion.p
          key={i}
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 9,
            color,
            letterSpacing: "0.12em",
            lineHeight: 1.7,
            margin: 0,
            textTransform: "uppercase",
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}

// ── Blinking cursor ───────────────────────────────────────────────────────────
function Cursor({ color }: { color: string }) {
  return (
    <motion.span
      style={{ display: "inline-block", width: 6, height: 11, background: color, marginLeft: 2, verticalAlign: "middle" }}
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
    />
  );
}

// ── Corner bracket (thin, techy) ─────────────────────────────────────────────
function TechCorner({
  corner, color, size = 18,
}: {
  corner: "tl" | "tr" | "bl" | "br"; color: string; size?: number;
}) {
  const tl = corner === "tl", tr = corner === "tr", bl = corner === "bl", br = corner === "br";
  return (
    <motion.div
      style={{
        width: size, height: size,
        borderTop:    (tl || tr) ? `1px solid ${color}` : undefined,
        borderBottom: (bl || br) ? `1px solid ${color}` : undefined,
        borderLeft:   (tl || bl) ? `1px solid ${color}` : undefined,
        borderRight:  (tr || br) ? `1px solid ${color}` : undefined,
      }}
      animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ── Node dot at trace junction ────────────────────────────────────────────────
function Node({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <motion.div
      style={{
        width: 5, height: 5, borderRadius: "50%",
        background: color,
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
      }}
      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2.5, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

// ── Binary stream ─────────────────────────────────────────────────────────────
function BinaryStream({ color, delay = 0 }: { color: string; delay?: number }) {
  const bits = "10110010110110001010011010110010110011";
  return (
    <motion.div
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 8,
        color,
        letterSpacing: "0.18em",
        writingMode: "vertical-lr",
        userSelect: "none",
        lineHeight: 1.8,
      }}
      animate={{ y: [0, -60, 0], opacity: [0.12, 0.28, 0.12] }}
      transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      {bits}
    </motion.div>
  );
}

// ── Glyphs data ───────────────────────────────────────────────────────────────
const glyphs = [
  { text: "</>",  left: "6%",  top: "20%",  delay: 0,    color: P(0.4) },
  { text: "{ }",  left: "85%", top: "15%",  delay: 0.8,  color: T(0.38) },
  { text: "=>",   left: "13%", top: "72%",  delay: 1.5,  color: P(0.35) },
  { text: "( )",  left: "80%", top: "74%",  delay: 0.4,  color: L(0.38) },
  { text: "&&",   left: "43%", top: "5%",   delay: 1.1,  color: T(0.35) },
  { text: "::",   left: "55%", top: "91%",  delay: 0.7,  color: P(0.38) },
  { text: "[ ]",  left: "91%", top: "48%",  delay: 0.3,  color: L(0.35) },
  { text: "===",  left: "3%",  top: "52%",  delay: 1.9,  color: T(0.32) },
  { text: "!==",  left: "70%", top: "8%",   delay: 0.6,  color: P(0.32) },
  { text: "?.",   left: "88%", top: "32%",  delay: 2.0,  color: T(0.35) },
  { text: "//",   left: "20%", top: "88%",  delay: 1.6,  color: L(0.32) },
  { text: "fn()", left: "33%", top: "10%",  delay: 1.3,  color: P(0.3)  },
];

// ── Master component ──────────────────────────────────────────────────────────
export default function HeroDecorationsV2() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(false);
      return;
    }
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {active && (<>

      {/* ── Full-hero SVG circuit traces ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* LEFT SIDE traces — coming in from left edge */}
        <TracePulse d="M 0,140 L 80,140 L 80,220 L 180,220 L 180,260"  color={P(CONFIG.pulseOpacity.purple)}   duration={CONFIG.speed.long}   delay={0}  pathLen={380} />
        <TracePulse d="M 0,340 L 110,340 L 110,290 L 220,290"          color={T(CONFIG.pulseOpacity.teal)}     duration={CONFIG.speed.long}   delay={4}  pathLen={320} />
        <TracePulse d="M 0,520 L 70,520 L 70,440 L 160,440 L 160,400"  color={L(CONFIG.pulseOpacity.lavender)} duration={CONFIG.speed.long}   delay={8}  pathLen={360} />

        {/* RIGHT SIDE traces — coming in from right edge */}
        <TracePulse d="M 1200,160 L 1110,160 L 1110,240 L 1010,240 L 1010,280" color={T(CONFIG.pulseOpacity.teal)}     duration={CONFIG.speed.long}   delay={2}  pathLen={380} />
        <TracePulse d="M 1200,360 L 1080,360 L 1080,300 L 970,300"             color={P(CONFIG.pulseOpacity.purple)}   duration={CONFIG.speed.long}   delay={6}  pathLen={320} />
        <TracePulse d="M 1200,540 L 1120,540 L 1120,460 L 1030,460 L 1030,420" color={L(CONFIG.pulseOpacity.lavender)} duration={CONFIG.speed.long}   delay={10} pathLen={370} />

        {/* TOP EDGE traces — dropping from top */}
        <TracePulse d="M 260,0 L 260,70 L 320,70 L 320,130"   color={P(CONFIG.pulseOpacity.purple)}   duration={CONFIG.speed.medium} delay={1}  pathLen={260} />
        <TracePulse d="M 580,0 L 580,55 L 650,55 L 650,100"   color={T(CONFIG.pulseOpacity.teal)}     duration={CONFIG.speed.medium} delay={7}  pathLen={240} />
        <TracePulse d="M 880,0 L 880,70 L 820,70 L 820,120"   color={L(CONFIG.pulseOpacity.lavender)} duration={CONFIG.speed.medium} delay={3}  pathLen={250} />

        {/* BOTTOM EDGE traces — rising from bottom */}
        <TracePulse d="M 200,700 L 200,630 L 270,630 L 270,580" color={T(CONFIG.pulseOpacity.teal)}     duration={CONFIG.speed.medium} delay={5}  pathLen={250} />
        <TracePulse d="M 550,700 L 550,640 L 480,640 L 480,590" color={P(CONFIG.pulseOpacity.purple)}   duration={CONFIG.speed.medium} delay={9}  pathLen={260} />
        <TracePulse d="M 920,700 L 920,620 L 860,620 L 860,570" color={L(CONFIG.pulseOpacity.lavender)} duration={CONFIG.speed.medium} delay={11} pathLen={250} />

        {/* DIAGONAL connector traces */}
        <TracePulse d="M 180,260 L 240,260 L 300,310"  color={P(0.45)} duration={CONFIG.speed.short} delay={3}  pathLen={200} strokeWidth={0.8} />
        <TracePulse d="M 1010,280 L 950,280 L 900,320" color={T(0.45)} duration={CONFIG.speed.short} delay={8}  pathLen={200} strokeWidth={0.8} />
        <TracePulse d="M 320,130 L 320,180 L 380,180"  color={P(0.4)}  duration={CONFIG.speed.short} delay={6}  pathLen={200} strokeWidth={0.8} />
        <TracePulse d="M 820,120 L 820,175 L 760,175"  color={L(0.4)}  duration={CONFIG.speed.short} delay={1}  pathLen={200} strokeWidth={0.8} />
      </svg>

      {/* ── Junction nodes ── */}
      <div className="absolute" style={{ left: "15%",  top: "37%"  }}><Node color={P(0.9)} delay={0}   /></div>
      <div className="absolute" style={{ left: "18.3%",top: "31%"  }}><Node color={P(0.8)} delay={0.3} /></div>
      <div className="absolute" style={{ left: "83.5%",top: "38%"  }}><Node color={T(0.9)} delay={0.5} /></div>
      <div className="absolute" style={{ left: "80.8%",top: "31%"  }}><Node color={T(0.8)} delay={0.8} /></div>
      <div className="absolute" style={{ left: "26.7%",top: "18%"  }}><Node color={P(0.75)} delay={1.0}/></div>
      <div className="absolute" style={{ left: "54.2%",top: "14%"  }}><Node color={T(0.75)} delay={0.4}/></div>
      <div className="absolute" style={{ left: "68.3%",top: "17%"  }}><Node color={L(0.75)} delay={0.7}/></div>
      <div className="absolute" style={{ left: "22.5%",top: "82%"  }}><Node color={T(0.75)} delay={1.2}/></div>
      <div className="absolute" style={{ left: "40%",  top: "84%"  }}><Node color={P(0.75)} delay={0.6}/></div>
      <div className="absolute" style={{ left: "71.7%",top: "80%"  }}><Node color={L(0.75)} delay={0.9}/></div>

      {/* ── Corner tech brackets ── */}
      <div className="absolute top-7 left-7 flex flex-col gap-1">
        <TechCorner corner="tl" color={P(0.6)} size={20} />
      </div>
      <div className="absolute top-7 right-7 flex flex-col items-end gap-1">
        <TechCorner corner="tr" color={T(0.6)} size={20} />
      </div>
      <div className="absolute bottom-7 left-7">
        <TechCorner corner="bl" color={T(0.6)} size={20} />
      </div>
      <div className="absolute bottom-7 right-7">
        <TechCorner corner="br" color={P(0.6)} size={20} />
      </div>

      {/* ── HUD corner readouts ── */}
      <div className="absolute top-10 left-10 hidden lg:block">
        <HudLabel
          color={P(0.45)}
          lines={["SYS.ACTIVE", "BUILD v2.4.1"]}
        />
        <div style={{ marginTop: 4, display: "flex", alignItems: "center", fontFamily: "monospace", fontSize: 9, color: P(0.5) }}>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }}>▋</motion.span>
        </div>
      </div>

      <div className="absolute top-10 right-10 hidden lg:block text-right">
        <HudLabel
          color={T(0.45)}
          align="right"
          lines={["ARCH:DIGITAL", "STATUS:ONLINE"]}
        />
      </div>

      <div className="absolute bottom-10 left-10 hidden lg:block">
        <HudLabel
          color={T(0.4)}
          lines={["LAT:24.8617N", "LNG:91.8833E"]}
        />
      </div>

      <div className="absolute bottom-10 right-10 hidden lg:block text-right">
        <HudLabel
          color={P(0.4)}
          align="right"
          lines={["STACK:FULL", "ENV:PROD"]}
        />
      </div>

      {/* ── Floating code glyphs ── */}
      {glyphs.map((g, i) => (
        <div key={i} className="absolute" style={{ left: g.left, top: g.top }}>
          <CodeGlyph text={g.text} color={g.color} delay={g.delay} />
        </div>
      ))}

      {/* ── Binary streams on far edges ── */}
      <div className="absolute top-1/4 left-0 hidden xl:block" style={{ height: "50%" }}>
        <BinaryStream color={P(0.2)} delay={0} />
      </div>
      <div className="absolute top-[30%] right-0 hidden xl:block" style={{ height: "40%" }}>
        <BinaryStream color={T(0.18)} delay={1.5} />
      </div>

      </>)}
    </div>
  );
}
