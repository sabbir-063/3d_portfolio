"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollBridge() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY < window.innerHeight * 0.75);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="scroll-bridge"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6, transition: { duration: 0.25 } }}
          transition={{ delay: 1.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full glass-panel flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-primary text-[18px]">
              keyboard_arrow_down
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
