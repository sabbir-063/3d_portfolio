"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { featuredSkills, skillGroups } from "./skillData";
import SkillRadial from "./SkillRadial";
import SkillBar from "./SkillBar";
import { SectionHeading, GlassCard, AnimatedBlob } from "@/components/ui";

const accentMap = ["text-primary", "text-secondary", "text-tertiary"];

export default function Skills() {
  const headingRef = useRef<HTMLDivElement>(null);
  const radialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="Skills" className="py-28 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      <AnimatedBlob color="bg-primary" size="w-[300px] h-[300px]" position="top-[5%] -right-[4%]" duration={11} delay={1} />
      <AnimatedBlob color="bg-tertiary" size="w-[250px] h-[250px]" position="bottom-[10%] -left-[4%]" duration={8} delay={2} />

      <div className="max-w-6xl mx-auto relative z-10 space-y-14">

        {/* Heading */}
        <div ref={headingRef}>
          <SectionHeading
            pre="Skill"
            accent="Matrix"
            accentClassName="text-tertiary"
            subtitle="Proficiency across the full stack — from pixel-perfect UI to cloud infrastructure."
            dividerColor="from-tertiary"
          />
        </div>

        {/* Featured radial indicators */}
        <GlassCard>
          <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-label mb-6 text-center">
            Core Proficiencies
          </p>
          <div
            ref={radialsRef}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center"
          >
            {featuredSkills.map((skill, i) => (
              <SkillRadial key={skill.name} {...skill} index={i} />
            ))}
          </div>
        </GlassCard>

        {/* Skill bar groups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {skillGroups.map((group, gi) => (
            <GlassCard key={group.category} padding="p-6" className="space-y-4">
              {/* Group header */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-7 h-7 rounded-lg glass-panel flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-[16px] ${accentMap[gi]}`}>
                    {group.icon}
                  </span>
                </div>
                <span className={`text-xs font-bold font-label uppercase tracking-wider ${accentMap[gi]}`}>
                  {group.category}
                </span>
              </div>

              {/* Bars */}
              <div className="space-y-4">
                {group.skills.map((skill, si) => (
                  <SkillBar
                    key={skill.name}
                    {...skill}
                    accentClass={accentMap[gi]}
                    index={si}
                    groupIndex={gi}
                  />
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
}
