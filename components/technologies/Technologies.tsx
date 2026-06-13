"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motion, AnimatePresence } from "framer-motion";
import { techs, categories } from "./techData";
import TechCard from "./TechCard";
import { SectionHeading, AnimatedBlob } from "@/components/ui";

export default function Technologies() {
  const [activeCategory, setActiveCategory] = useState("All");
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === "All"
    ? techs
    : techs.filter((t) => t.category === activeCategory);

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

      gsap.from(filterRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: filterRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          opacity: 0,
          y: 32,
          scale: 0.92,
          stagger: 0.045,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="Technologies" className="py-28 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      {/* Grid pattern accent */}
      <div className="absolute inset-0 soft-grid opacity-40 pointer-events-none" />
      <AnimatedBlob color="bg-secondary" position="top-[5%] -left-[5%]" duration={13} />
      <AnimatedBlob color="bg-tertiary" size="w-[250px] h-[250px]" position="bottom-[10%] -right-[4%]" duration={9} delay={3} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Heading */}
        <div ref={headingRef} className="mb-10">
          <SectionHeading
            pre="Tech"
            accent="Arsenal"
            accentClassName="text-secondary"
            subtitle="Tools and technologies I wield to build performant, scalable systems."
            dividerColor="from-secondary"
          />
        </div>

        {/* Category filter */}
        <div ref={filterRef} className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold font-label uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "glass-panel text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tech grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            ref={gridRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3"
          >
            {filtered.map((tech) => (
              <TechCard key={tech.name} {...tech} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
