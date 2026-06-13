"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface SkillRadialProps {
  name: string;
  level: number;
  color: string;
  trackColor: string;
  index: number;
}

const SIZE = 88;
const STROKE = 5;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function SkillRadial({ name, level, color, trackColor, index }: SkillRadialProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const circle = circleRef.current;
    const label = labelRef.current;
    const wrap = wrapRef.current;
    if (!circle || !label || !wrap) return;

    const offset = CIRCUMFERENCE - (level / 100) * CIRCUMFERENCE;
    const counter = { val: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    tl.from(wrap, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      delay: index * 0.1,
      ease: "back.out(1.4)",
    })
      .to(
        circle,
        {
          strokeDashoffset: offset,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=0.2"
      )
      .to(
        counter,
        {
          val: level,
          duration: 1.2,
          ease: "power3.out",
          onUpdate: () => {
            if (label) label.textContent = Math.ceil(counter.val) + "%";
          },
        },
        "<"
      );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === wrap) st.kill();
      });
    };
  }, [level, index]);

  return (
    <div ref={wrapRef} className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={trackColor}
            strokeWidth={STROKE}
          />
          {/* Progress */}
          <circle
            ref={circleRef}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            ref={labelRef}
            className="text-sm font-bold font-headline text-on-surface"
          >
            0%
          </span>
        </div>
      </div>
      <p className="text-[11px] text-on-surface-variant font-label text-center leading-tight max-w-[80px]">
        {name}
      </p>
    </div>
  );
}
