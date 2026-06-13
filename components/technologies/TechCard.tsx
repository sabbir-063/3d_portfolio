"use client";

import { motion } from "framer-motion";
import type { Tech } from "./techData";

export default function TechCard({ name, category, textColor, borderColor, glowColor, abbr }: Tech) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`glass-panel rounded-xl p-4 flex flex-col items-center gap-2.5 border ${borderColor} cursor-default group hover:${glowColor} transition-shadow duration-300`}
    >
      {/* Abbr icon circle */}
      <div
        className={`w-10 h-10 rounded-xl glass-panel flex items-center justify-center border ${borderColor} group-hover:scale-110 transition-transform duration-300`}
      >
        <span className={`text-sm font-bold font-headline ${textColor}`}>
          {abbr}
        </span>
      </div>

      <div className="text-center">
        <p className="text-on-surface text-xs font-semibold font-headline leading-tight">
          {name}
        </p>
        <p className={`text-[10px] ${textColor} opacity-70 font-label mt-0.5`}>
          {category}
        </p>
      </div>
    </motion.div>
  );
}
