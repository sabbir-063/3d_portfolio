"use client";

import { ScrollReveal, TagPill } from "@/components/ui";
import { experiences } from "./aboutData";

export default function ExperienceSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-5">
        <span className="material-symbols-outlined text-primary text-[18px]">work</span>
        <h3 className="text-xs font-bold font-label uppercase tracking-widest text-primary">
          Experience
        </h3>
      </div>

      <div className="relative pl-5 space-y-6">
        {/* Timeline line */}
        <div className="absolute left-1.5 top-2 bottom-2 w-px bg-primary/20" />

        {experiences.map((exp, ei) => (
          <ScrollReveal key={ei} direction="right" delay={ei * 0.1}>
            <div className="relative">
              {/* Company dot */}
              <div className="absolute -left-[17px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary/70 border border-primary/40" />

              <div className="glass-panel rounded-xl overflow-hidden">
                {/* Company header */}
                <div className="px-4 pt-4 pb-3 border-b border-black/[0.06] dark:border-white/5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-on-surface text-sm font-bold font-headline">{exp.company}</p>
                      <p className="text-on-surface-variant text-[11px] font-label mt-0.5">
                        {exp.type}
                      </p>
                    </div>
                    {exp.roles.some((r) => r.current) && (
                      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-primary glass-panel px-2 py-1 rounded-full border-primary/20 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Now
                      </span>
                    )}
                  </div>
                </div>

                {/* Roles */}
                <div className="divide-y divide-black/[0.06] dark:divide-white/5">
                  {exp.roles.map((role, ri) => (
                    <div key={ri} className="px-4 py-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-on-surface text-xs font-semibold font-headline">
                          {role.title}
                        </p>
                        {role.current && (
                          <span className="text-[9px] text-primary font-label shrink-0">● Active</span>
                        )}
                      </div>
                      <p className="text-on-surface-variant text-[11px] font-label">
                        {role.period}
                        {role.location && ` · ${role.location}`}
                        {role.mode && ` · ${role.mode}`}
                      </p>
                      {role.description && (
                        <p className="text-on-surface-variant/80 text-[11px] font-body leading-relaxed line-clamp-3">
                          {role.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {role.skills.map((skill) => (
                          <TagPill
                            key={skill}
                            label={skill}
                            colorClass="text-primary"
                            borderClass="border-primary/20"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
