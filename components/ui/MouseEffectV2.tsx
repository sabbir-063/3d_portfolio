"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Burst { id: number; x: number; y: number; type: "left" | "right" }

// ── Config ────────────────────────────────────────────────────────────────────
const ARM_LEN  = 32;   // crosshair arm length (px)
const ARM_GAP  = 7;    // gap around center dot
const BKT_OFF  = 26;   // bracket distance from center
const BKT_SIZE = 10;   // bracket arm length
const RING_R   = 48;   // outer faint ring radius

const C_PURPLE  = "rgba(199,185,245,";
const C_TEAL    = "rgba(201,232,238,";

// Tick-mark gradient on crosshair arms
const TICK_H = `repeating-linear-gradient(to right,
  ${C_PURPLE}0.65) 0px, ${C_PURPLE}0.65) 1px,
  transparent 1px, transparent 8px)`;
const TICK_V = `repeating-linear-gradient(to bottom,
  ${C_PURPLE}0.65) 0px, ${C_PURPLE}0.65) 1px,
  transparent 1px, transparent 8px)`;

export default function MouseEffectV2() {
  const [bursts,  setBursts]  = useState<Burst[]>([]);
  const [visible, setVisible] = useState(false);
  const idRef = useRef(0);

  // All cursor DOM refs
  const dotRef   = useRef<HTMLDivElement>(null);
  const armT     = useRef<HTMLDivElement>(null);
  const armB     = useRef<HTMLDivElement>(null);
  const armL     = useRef<HTMLDivElement>(null);
  const armR     = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const bktRefs  = useRef<(HTMLDivElement | null)[]>([]);

  const mx = useRef(-400);
  const my = useRef(-400);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.style.cursor = "none";

    let frame: number;
    const t0 = performance.now();

    function tick(now: number) {
      const t = (now - t0) / 1000;
      const x = mx.current;
      const y = my.current;

      // Center dot
      dotRef.current?.style.setProperty("transform",
        `translate(${x}px,${y}px) translate(-50%,-50%)`);

      // Crosshair arms
      armT.current?.style.setProperty("transform",
        `translate(${x}px,${y - ARM_GAP - ARM_LEN}px) translate(-50%,0)`);
      armB.current?.style.setProperty("transform",
        `translate(${x}px,${y + ARM_GAP}px) translate(-50%,0)`);
      armL.current?.style.setProperty("transform",
        `translate(${x - ARM_GAP - ARM_LEN}px,${y}px) translate(0,-50%)`);
      armR.current?.style.setProperty("transform",
        `translate(${x + ARM_GAP}px,${y}px) translate(0,-50%)`);

      // Coordinate readout
      if (coordRef.current) {
        const xStr = String(Math.round(x)).padStart(4, "0");
        const yStr = String(Math.round(y)).padStart(4, "0");
        coordRef.current.style.transform = `translate(${x + 13}px,${y + 10}px)`;
        coordRef.current.textContent = `X:${xStr}  Y:${yStr}`;
      }

      // Outer ring — slow breathe
      const scale = 1 + Math.sin(t * 1.2) * 0.04;
      ringRef.current?.style.setProperty("transform",
        `translate(${x}px,${y}px) translate(-50%,-50%) scale(${scale})`);

      // Corner brackets — breathe slightly inward/outward
      const bOff = BKT_OFF + Math.sin(t * 1.2) * 2;
      const bktPositions = [
        { dx: -bOff, dy: -bOff },
        { dx:  bOff, dy: -bOff },
        { dx:  bOff, dy:  bOff },
        { dx: -bOff, dy:  bOff },
      ];
      bktPositions.forEach(({ dx, dy }, i) => {
        bktRefs.current[i]?.style.setProperty("transform",
          `translate(${x + dx}px,${y + dy}px) translate(-50%,-50%)`);
      });

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;
      setVisible(true);
    };

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const id = ++idRef.current;
      setBursts(p => [...p, { id, x: e.clientX, y: e.clientY, type: "left" }]);
      setTimeout(() => setBursts(p => p.filter(b => b.id !== id)), 1000);
    };

    const onCtx = (e: MouseEvent) => {
      if (process.env.NODE_ENV === "production") e.preventDefault();
      const id = ++idRef.current;
      setBursts(p => [...p, { id, x: e.clientX, y: e.clientY, type: "right" }]);
      setTimeout(() => setBursts(p => p.filter(b => b.id !== id)), 1000);
    };

    window.addEventListener("mousemove",    onMove);
    window.addEventListener("mousedown",    onDown);
    window.addEventListener("contextmenu",  onCtx);
    document.addEventListener("mouseleave", () => setVisible(false));
    document.addEventListener("mouseenter", () => setVisible(true));

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.cursor = "";
      window.removeEventListener("mousemove",   onMove);
      window.removeEventListener("mousedown",   onDown);
      window.removeEventListener("contextmenu", onCtx);
    };
  }, []);

  // ── Corner bracket styles ──────────────────────────────────────────────────
  const bktBorders = [
    { borderTop: `1.5px solid ${C_PURPLE}0.55)`, borderLeft:  `1.5px solid ${C_PURPLE}0.55)` },
    { borderTop: `1.5px solid ${C_PURPLE}0.55)`, borderRight: `1.5px solid ${C_PURPLE}0.55)` },
    { borderBottom: `1.5px solid ${C_PURPLE}0.55)`, borderRight: `1.5px solid ${C_PURPLE}0.55)` },
    { borderBottom: `1.5px solid ${C_PURPLE}0.55)`, borderLeft:  `1.5px solid ${C_PURPLE}0.55)` },
  ];

  return (
    <>
      <style>{`@media (pointer: fine) { *, *::before, *::after { cursor: none !important; } }`}</style>

      {/* ── Cursor layer ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99998,
        opacity: visible ? 1 : 0, transition: "opacity 0.2s",
      }}>
        {/* Crosshair arms with tick marks */}
        <div ref={armT} style={{
          position: "fixed", top: 0, left: 0,
          width: 1, height: ARM_LEN,
          background: TICK_V,
          boxShadow: `0 0 4px ${C_PURPLE}0.4)`,
          willChange: "transform",
        }} />
        <div ref={armB} style={{
          position: "fixed", top: 0, left: 0,
          width: 1, height: ARM_LEN,
          background: TICK_V,
          boxShadow: `0 0 4px ${C_PURPLE}0.4)`,
          willChange: "transform",
        }} />
        <div ref={armL} style={{
          position: "fixed", top: 0, left: 0,
          height: 1, width: ARM_LEN,
          background: TICK_H,
          boxShadow: `0 0 4px ${C_PURPLE}0.4)`,
          willChange: "transform",
        }} />
        <div ref={armR} style={{
          position: "fixed", top: 0, left: 0,
          height: 1, width: ARM_LEN,
          background: TICK_H,
          boxShadow: `0 0 4px ${C_PURPLE}0.4)`,
          willChange: "transform",
        }} />

        {/* Coordinate readout */}
        <div ref={coordRef} style={{
          position: "fixed", top: 0, left: 0,
          fontFamily: "'JetBrains Mono','Fira Code',monospace",
          fontSize: 8, letterSpacing: "0.14em",
          color: `${C_PURPLE}0.55)`,
          whiteSpace: "nowrap",
          willChange: "transform",
          textTransform: "uppercase",
        }} />

        {/* Outer faint ring */}
        <div ref={ringRef} style={{
          position: "fixed", top: 0, left: 0,
          width: RING_R * 2, height: RING_R * 2,
          borderRadius: "50%",
          border: `1px dashed ${C_PURPLE}0.1)`,
          willChange: "transform",
        }} />

        {/* Corner brackets */}
        {bktBorders.map((style, i) => (
          <div
            key={i}
            ref={el => { bktRefs.current[i] = el; }}
            style={{
              position: "fixed", top: 0, left: 0,
              width: BKT_SIZE, height: BKT_SIZE,
              ...style,
              willChange: "transform",
            }}
          />
        ))}

        {/* Center dot */}
        <div ref={dotRef} style={{
          position: "fixed", top: 0, left: 0,
          width: 4, height: 4, borderRadius: "50%",
          background: `${C_PURPLE}1)`,
          boxShadow: `0 0 6px ${C_PURPLE}1), 0 0 14px ${C_PURPLE}0.5)`,
          willChange: "transform",
        }} />
      </div>

      {/* ── Click bursts ── */}
      <AnimatePresence>
        {bursts.map(burst => {
          const isLeft = burst.type === "left";
          const c = isLeft ? C_PURPLE : C_TEAL;
          const angles = [0, 45, 90, 135, 180, 225, 270, 315];

          return (
            <div key={burst.id} style={{ position: "fixed", inset: 0, zIndex: 99999, pointerEvents: "none" }}>

              {/* ── Full-viewport crosshair flash ── */}
              <motion.div
                style={{
                  position: "fixed",
                  left: burst.x, top: 0, bottom: 0,
                  width: 1,
                  background: `linear-gradient(to bottom, transparent, ${c}0.25), transparent)`,
                  translateX: "-50%",
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
              <motion.div
                style={{
                  position: "fixed",
                  top: burst.y, left: 0, right: 0,
                  height: 1,
                  background: `linear-gradient(to right, transparent, ${c}0.25), transparent)`,
                  translateY: "-50%",
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />

              {/* Central glow */}
              <motion.div
                style={{
                  position: "fixed", left: burst.x, top: burst.y,
                  translateX: "-50%", translateY: "-50%",
                  width: 8, height: 8, borderRadius: "50%",
                  background: `${c}1)`,
                  boxShadow: `0 0 20px ${c}0.9), 0 0 50px ${c}0.4)`,
                }}
                initial={{ scale: 1.5, opacity: 1 }}
                animate={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />

              {/* Expanding rings */}
              {[0.45, 0.65, 0.85].map((dur, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "fixed", left: burst.x, top: burst.y,
                    translateX: "-50%", translateY: "-50%",
                    width: 8, height: 8, borderRadius: "50%",
                    border: `1px solid ${c}${0.7 - i * 0.2})`,
                  }}
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{ scale: 5 + i * 2.5, opacity: 0 }}
                  transition={{ duration: dur, ease: "easeOut" }}
                />
              ))}

              {/* Particles */}
              {angles.map((angle, i) => {
                const rad  = (angle * Math.PI) / 180;
                const dist = 30 + (i % 2) * 14;
                return (
                  <motion.div
                    key={i}
                    style={{
                      position: "fixed", left: burst.x, top: burst.y,
                      translateX: "-50%", translateY: "-50%",
                      width: i % 2 === 0 ? 3 : 2,
                      height: i % 2 === 0 ? 3 : 2,
                      borderRadius: "50%",
                      background: `${c}0.9)`,
                      boxShadow: `0 0 5px ${c}0.7)`,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos(rad) * dist,
                      y: Math.sin(rad) * dist,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.65, ease: "easeOut", delay: i * 0.02 }}
                  />
                );
              })}
            </div>
          );
        })}
      </AnimatePresence>
    </>
  );
}
