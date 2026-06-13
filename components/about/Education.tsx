"use client";

import { ScrollReveal } from "@/components/ui";
import { education } from "./aboutData";

export default function EducationSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-5">
        <span className="material-symbols-outlined text-secondary text-[18px]">school</span>
        <h3 className="text-xs font-bold font-label uppercase tracking-widest text-secondary">
          Education
        </h3>
      </div>

      <div className="relative pl-5 space-y-5">
        {/* Timeline line */}
        <div className="absolute left-1.5 top-2 bottom-2 w-px bg-secondary/20" />

        {education.map((edu, i) => (
          <ScrollReveal key={i} direction="left" delay={i * 0.1}>
            <div className="relative">
              {/* Dot */}
              <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-secondary/60 border border-secondary/40" />

              <div className="glass-panel rounded-xl p-4">
                <p className="text-on-surface text-sm font-bold font-headline leading-tight">
                  {edu.degree}
                </p>
                <p className="text-on-surface-variant text-xs mt-1 font-body">
                  {edu.institution}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-block text-[10px] font-bold font-label uppercase tracking-wider text-secondary/80 glass-panel px-2 py-0.5 rounded-full border-secondary/20">
                    {edu.period}
                  </span>
                  {edu.detail && (
                    <span className="inline-block text-[10px] font-label text-on-surface-variant glass-panel px-2 py-0.5 rounded-full">
                      {edu.detail}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
