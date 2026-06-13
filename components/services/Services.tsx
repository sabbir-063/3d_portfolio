"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { services } from "./serviceData";
import ServiceCard from "./ServiceCard";
import { SectionHeading, AnimatedBlob } from "@/components/ui";

export default function Services() {
  const headingRef = useRef<HTMLDivElement>(null);

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
    <section id="Services" className="py-28 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      <AnimatedBlob color="bg-primary" size="w-[380px] h-[380px]" position="top-[5%] -right-[6%]" duration={11} delay={0.5} />
      <AnimatedBlob color="bg-secondary" size="w-[250px] h-[250px]" position="bottom-[10%] -left-[4%]" duration={13} delay={2} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div ref={headingRef} className="mb-14">
          <SectionHeading
            pre="What I"
            accent="Offer"
            accentClassName="text-primary text-glow"
            subtitle="You bring the problem. I figure out where to start, what to build, and how to ship it without wasting your time."
            dividerColor="from-primary"
          />
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {services.map((service, i) => (
            <ServiceCard key={service.number} {...service} index={i} />
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-10 glass-panel rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-on-surface font-bold font-headline text-sm">Have a project in mind?</p>
            <p className="text-on-surface-variant text-xs font-body mt-0.5">Worst case, we have a good conversation about your idea.</p>
          </div>
          <a
            href="#Contact"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-bold font-headline text-sm rounded-xl glow-primary hover:scale-105 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
