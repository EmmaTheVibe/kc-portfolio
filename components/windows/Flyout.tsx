"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Acrylic panel look shared by Start, Quick Settings and the calendar. */
export const acrylic =
  "rounded-lg border border-black/10 bg-[#eeeeee]/90 text-black shadow-popover backdrop-blur-3xl dark:border-white/10 dark:bg-[#2c2c2c]/90 dark:text-white";

/** A taskbar flyout: anchored just above the taskbar, sliding up as it opens. */
export function Flyout({ label, className, children }: { label: string; className: string; children: ReactNode }) {
  return (
    <motion.div
      role="dialog"
      aria-label={label}
      className={`fixed bottom-14 z-9002 ${className}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    >
      {children}
    </motion.div>
  );
}
