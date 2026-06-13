"use client";

import { ScrollReveal } from "@/components/ui";

interface StatCardProps {
  value: string;
  label: string;
  sub: string;
  accentColor: string;
  glowColor: string;
  index: number;
}

export default function StatCard({
  value,
  label,
  sub,
  accentColor,
  glowColor,
  index,
}: StatCardProps) {
  return (
    <ScrollReveal direction="up" delay={index * 0.12} amount={0.2}>
      <div className="glass-panel p-6 md:p-8 rounded-2xl glass-card-hover group relative overflow-hidden">
        {/* Glow orb */}
        <div
          className={`absolute -right-3 -bottom-3 w-20 h-20 ${glowColor} rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-all duration-500`}
        />
        <span className="text-4xl font-bold text-on-surface mb-2 font-headline block">
          {value}
        </span>
        <p className={`text-[11px] font-label uppercase tracking-widest ${accentColor} font-bold`}>
          {label}
        </p>
        <p className="mt-3 text-on-surface-variant/80 text-xs leading-relaxed">{sub}</p>
      </div>
    </ScrollReveal>
  );
}
