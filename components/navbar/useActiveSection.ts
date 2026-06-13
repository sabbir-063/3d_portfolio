"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks, contactLink } from "./navLinks";

const SECTION_IDS = [...navLinks, contactLink].map((l) => l.href.split("#")[1]);

export function useActiveSection(): string {
  const [active, setActive] = useState("Home");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    // Re-observe on each return to home — old observers point to unmounted nodes
    setActive("Home");

    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.35 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [pathname]);

  return active;
}
