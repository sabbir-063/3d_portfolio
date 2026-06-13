"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface SkillBarProps {
  name: string;
  level: number;
  accentClass: string;
  index: number;
  groupIndex: number;
}

export default function SkillBar({ name, level, accentClass, index, groupIndex }: SkillBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const fill = fillRef.current;
    const num = numRef.current;
    if (!row || !fill || !num) return;

    const counter = { val: 0 };
    const delay = groupIndex * 0.08 + index * 0.07;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });

    tl.from(row, {
      opacity: 0,
      x: -20,
      duration: 0.5,
      delay,
      ease: "power3.out",
    })
      .to(
        fill,
        { width: `${level}%`, duration: 1, ease: "power3.out" },
        "-=0.1"
      )
      .to(
        counter,
        {
          val: level,
          duration: 1,
          ease: "power3.out",
          onUpdate: () => {
            if (num) num.textContent = Math.ceil(counter.val) + "%";
          },
        },
        "<"
      );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === row) st.kill();
      });
    };
  }, [level, index, groupIndex]);

  return (
    <div ref={rowRef} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-on-surface-variant font-body">{name}</span>
        <span ref={numRef} className={`text-[11px] font-bold font-label ${accentClass}`}>
          0%
        </span>
      </div>
      <div ref={barRef} className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          ref={fillRef}
          style={{ width: "0%" }}
          className={`h-full rounded-full bg-gradient-to-r ${
            accentClass.includes("primary")
              ? "from-primary/70 to-primary"
              : accentClass.includes("secondary")
              ? "from-secondary/70 to-secondary"
              : "from-tertiary/70 to-tertiary"
          }`}
        />
      </div>
    </div>
  );
}
