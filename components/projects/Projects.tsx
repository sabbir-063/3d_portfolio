"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { projects, MAX_HOMEPAGE_PROJECTS } from "./projectData";
import ProjectCard from "./ProjectCard";
import { AnimatedBlob, SectionHeading } from "@/components/ui";
import Link from "next/link";

export default function Projects() {
  const headingRef = useRef<HTMLDivElement>(null);
  const visible = projects.slice(0, MAX_HOMEPAGE_PROJECTS);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0, y: 28, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none none" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="Projects" className="py-28 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      <AnimatedBlob color="bg-tertiary" size="w-[400px] h-[400px]" position="top-[15%] -left-[8%]" duration={14} />
      <AnimatedBlob color="bg-primary" size="w-[250px] h-[250px]" position="bottom-[10%] -right-[4%]" duration={9} delay={2.5} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading — centered, View All floated right */}
        <div ref={headingRef} className="relative mb-12">
          <SectionHeading
            pre="Living"
            accent="Artifacts"
            accentClassName="text-primary text-glow"
            subtitle="Selected work across full-stack engineering, dashboards, and digital ecosystems."
            dividerColor="from-primary"
          />
          <Link
            href="/projects"
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 glass-panel text-xs text-on-surface-variant hover:text-on-surface rounded-full hover:bg-black/[0.06] dark:hover:bg-white/5 transition-all font-headline"
          >
            View All
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visible.map((project, i) => (
            <ProjectCard key={project.id} {...project} index={i} />
          ))}
        </div>

        {projects.length > MAX_HOMEPAGE_PROJECTS && (
          <p className="text-center text-xs text-on-surface-variant mt-8 font-label">
            Showing {visible.length} of {projects.length} projects.{" "}
            <Link href="/projects" className="text-primary hover:underline">See all →</Link>
          </p>
        )}
      </div>
    </section>
  );
}
