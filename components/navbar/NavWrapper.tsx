"use client";

import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import Navbar from "./Navbar";
import SideNav from "./SideNav";

export default function NavWrapper() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Read saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const dark = saved ? saved === "dark" : true;
    setIsDark(dark);
    setMounted(true);
  }, []);

  // Apply class + persist on change
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, mounted]);

  // Avoid flash of wrong theme before mount
  if (!mounted) return null;

  function handleToggle(_e: React.MouseEvent) {
    if (!("startViewTransition" in document)) {
      setIsDark((prev) => !prev);
      return;
    }

    (document as Document & { startViewTransition: (cb: () => void) => void })
      .startViewTransition(() => {
        flushSync(() => setIsDark((prev) => !prev));
      });
  }

  return (
    <>
      <Navbar onThemeToggle={handleToggle} isDark={isDark} />
      <SideNav />
    </>
  );
}
