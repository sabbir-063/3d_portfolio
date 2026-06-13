"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="back-to-top"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            bottom: "max(1.25rem, calc(env(safe-area-inset-bottom) + 0.75rem))",
            right: "max(1.25rem, calc(env(safe-area-inset-right) + 0.75rem))",
          }}
          className="fixed z-50"
        >
          {/* Button — position:relative so tooltip can anchor to it */}
          <motion.button
            onClick={scrollToTop}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            aria-label="Back to top"
            className="relative w-11 h-11 rounded-full glass-panel flex items-center justify-center text-primary shadow-[0_4px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:border-primary/30 transition-[border,box-shadow] duration-300"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>

            {/* Tooltip — absolute so it never shifts the button */}
            <AnimatePresence>
              {hovered && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full mb-2 right-0 pointer-events-none glass-panel text-[10px] font-label font-bold uppercase tracking-widest text-primary px-2.5 py-1 rounded-full border-primary/20 whitespace-nowrap"
                >
                  Back to top
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
