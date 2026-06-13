"use client";

import { ScrollReveal } from "@/components/ui";
import type { Service } from "./serviceData";

export default function ServiceCard({
  number,
  icon,
  title,
  description,
  deliverables,
  stack,
  accentColor,
  glowColor,
  borderColor,
  index,
}: Service & { index: number }) {
  return (
    <ScrollReveal direction="up" delay={index * 0.1} amount={0.1}>
      <div className="glass-panel rounded-2xl glass-card-hover group relative overflow-hidden p-6 flex flex-col gap-5 h-full">

        {/* Large watermark number */}
        <span className={`absolute -top-3 -right-1 text-[80px] font-black font-headline leading-none ${accentColor} opacity-[0.06] select-none pointer-events-none`}>
          {number}
        </span>

        {/* Subtle glow blob on hover */}
        <div className={`absolute -bottom-6 -right-6 w-28 h-28 ${glowColor} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl glass-panel ${borderColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            <span className={`material-symbols-outlined text-[22px] ${accentColor}`}>{icon}</span>
          </div>
          <div>
            <p className={`text-[10px] font-bold font-label uppercase tracking-widest ${accentColor} mb-0.5`}>
              Service {number}
            </p>
            <h3 className="text-base font-bold text-on-surface font-headline leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-on-surface-variant text-xs leading-relaxed font-body">
          {description}
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-white/8 to-transparent" />

        {/* Deliverables */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 font-label mb-0.5">
            What you get
          </p>
          {deliverables.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[14px] ${accentColor} mt-0.5 shrink-0`}>check_circle</span>
              <span className="text-xs text-on-surface-variant font-body leading-snug">{item}</span>
            </div>
          ))}
        </div>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-black/[0.06] dark:border-white/5">
          {stack.map((tech) => (
            <span
              key={tech}
              className={`text-[9px] font-bold font-label uppercase tracking-wider px-2 py-0.5 rounded-full glass-panel ${borderColor} ${accentColor}`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
