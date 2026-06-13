"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Burst {
  id: number;
  x: number;
  y: number;
  type: "left" | "right";
}

const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const RING_LERP = 0.05;

const DARK = {
  left:  { solid: "rgba(199,185,245,", glow: "rgba(199,185,245," },
  right: { solid: "rgba(201,232,238,", glow: "rgba(201,232,238," },
  dot:   "rgba(199,185,245,1)",
  dotGlow: "0 0 6px rgba(199,185,245,0.9), 0 0 14px rgba(199,185,245,0.5)",
  ringBorder: "rgba(199,185,245,0.28)",
  ringBg:     "rgba(199,185,245,0.04)",
  ringShadow: "0 0 10px rgba(199,185,245,0.12), inset 0 0 10px rgba(199,185,245,0.05)",
  spot:       "rgba(199,185,245,0.7)",
  spotGlow:   "0 0 6px rgba(199,185,245,0.8)",
};

const LIGHT = {
  left:  { solid: "rgba(88,70,160,",  glow: "rgba(88,70,160,"  },
  right: { solid: "rgba(25,105,116,", glow: "rgba(25,105,116," },
  dot:   "rgba(88,70,160,1)",
  dotGlow: "0 0 6px rgba(88,70,160,0.7), 0 0 14px rgba(88,70,160,0.35)",
  ringBorder: "rgba(88,70,160,0.35)",
  ringBg:     "rgba(88,70,160,0.06)",
  ringShadow: "0 0 10px rgba(88,70,160,0.1), inset 0 0 10px rgba(88,70,160,0.05)",
  spot:       "rgba(88,70,160,0.8)",
  spotGlow:   "0 0 6px rgba(88,70,160,0.7)",
};

export default function MouseEffect() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [isDark, setIsDark] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const idRef = useRef(0);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Track theme changes
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // React to pointer / reduced-motion changes (e.g. toggling DevTools device toolbar)
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluate = () => setEnabled(!coarse.matches && !reduced.matches);
    evaluate();
    coarse.addEventListener("change", evaluate);
    reduced.addEventListener("change", evaluate);
    return () => {
      coarse.removeEventListener("change", evaluate);
      reduced.removeEventListener("change", evaluate);
    };
  }, []);

  // Position tracking — direct DOM, no React re-renders, no framer-motion springs
  useEffect(() => {
    if (!enabled) return;

    document.body.style.cursor = "none";

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let targetX = -300;
    let targetY = -300;
    let ringX = -300;
    let ringY = -300;
    let visible = false;
    let raf = 0;
    let running = false;

    const showCursors = () => {
      if (visible) return;
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const hideCursors = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const tick = () => {
      const dx = targetX - ringX;
      const dy = targetY - ringY;
      ringX += dx * RING_LERP;
      ringY += dy * RING_LERP;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      // Stop the loop once the ring has settled — restart on next mouse move
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const startTick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      // Inner dot: snap instantly so it always sits exactly under the pointer
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      showCursors();
      startTick();
    };

    const onDown = (e: MouseEvent) => {
      if (e.button === 2) return;
      const id = ++idRef.current;
      setBursts((prev) => [...prev, { id, x: e.clientX, y: e.clientY, type: "left" }]);
      window.setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 900);
    };

    const onContext = (e: MouseEvent) => {
      if (process.env.NODE_ENV === "production") e.preventDefault();
      const id = ++idRef.current;
      setBursts((prev) => [...prev, { id, x: e.clientX, y: e.clientY, type: "right" }]);
      window.setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 900);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("contextmenu", onContext);
    document.addEventListener("mouseleave", hideCursors);
    document.addEventListener("mouseenter", showCursors);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("contextmenu", onContext);
      document.removeEventListener("mouseleave", hideCursors);
      document.removeEventListener("mouseenter", showCursors);
    };
  }, [enabled]);

  const theme = isDark ? DARK : LIGHT;

  return (
    <>
      {enabled && (
        <style>{`*, *::before, *::after { cursor: none !important; }`}</style>
      )}

      {/* Inner precision dot — instant follow, direct DOM transforms */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: theme.dot,
          boxShadow: theme.dotGlow,
          opacity: 0,
          zIndex: 99999,
          pointerEvents: "none",
          willChange: "transform",
          transform: "translate3d(-300px, -300px, 0)",
          transition: "opacity 150ms ease, background 200ms ease",
        }}
      />

      {/* Trailing glass ring — eased follow via lerp */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: `1px solid ${theme.ringBorder}`,
          background: theme.ringBg,
          backdropFilter: "blur(1px)",
          WebkitBackdropFilter: "blur(1px)",
          boxShadow: theme.ringShadow,
          opacity: 0,
          zIndex: 99998,
          pointerEvents: "none",
          willChange: "transform",
          transform: "translate3d(-300px, -300px, 0)",
          transition: "opacity 200ms ease, border-color 200ms ease, background 200ms ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -2,
            left: "50%",
            marginLeft: -2,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: theme.spot,
            boxShadow: theme.spotGlow,
            transformOrigin: "2px 18px",
            animation: "mouse-spot-rot 3s linear infinite",
          }}
        />
      </div>

      <style>{`@keyframes mouse-spot-rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Click bursts — rare, event-driven, framer-motion is fine here */}
      <AnimatePresence>
        {bursts.map((burst) => {
          const c = burst.type === "left" ? theme.left : theme.right;
          return (
            <div key={burst.id} style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 99997 }}>
              <motion.div
                style={{
                  position: "fixed", left: burst.x, top: 0, bottom: 0, width: 1,
                  translateX: "-50%",
                  background: `linear-gradient(to bottom, transparent 0%, ${c.solid}0.3) 20%, ${c.solid}0.3) 80%, transparent 100%)`,
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <motion.div
                style={{
                  position: "fixed", top: burst.y, left: 0, right: 0, height: 1,
                  translateY: "-50%",
                  background: `linear-gradient(to right, transparent 0%, ${c.solid}0.3) 20%, ${c.solid}0.3) 80%, transparent 100%)`,
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />

              <motion.div
                style={{
                  position: "fixed",
                  left: burst.x, top: burst.y,
                  translateX: "-50%", translateY: "-50%",
                  width: 8, height: 8,
                  borderRadius: "50%",
                  border: `1px solid ${c.solid}0.7)`,
                  boxShadow: `0 0 8px ${c.glow}0.4)`,
                }}
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 7, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />

              <motion.div
                style={{
                  position: "fixed",
                  left: burst.x, top: burst.y,
                  translateX: "-50%", translateY: "-50%",
                  width: 6, height: 6,
                  borderRadius: "50%",
                  border: `1px solid ${c.solid}0.5)`,
                }}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />

              {PARTICLE_ANGLES.map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const dist = i % 2 === 0 ? 38 : 26;
                return (
                  <motion.div
                    key={i}
                    style={{
                      position: "fixed",
                      left: burst.x, top: burst.y,
                      translateX: "-50%", translateY: "-50%",
                      width: i % 2 === 0 ? 3 : 2,
                      height: i % 2 === 0 ? 3 : 2,
                      borderRadius: "50%",
                      background: `${c.solid}0.9)`,
                      boxShadow: `0 0 5px ${c.glow}0.7)`,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(rad) * dist,
                      y: Math.sin(rad) * dist,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
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
