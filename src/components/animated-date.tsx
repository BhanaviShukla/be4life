"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

export function AnimatedDate() {
  const prefersReducedMotion = useReducedMotion();
  const { theme } = useTheme();

  const dateSegmentVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: prefersReducedMotion ? 0 : 0.8 + i * 0.2,
        duration: prefersReducedMotion ? 0.01 : 0.4,
      },
    }),
  };

  return (
    <div className="font-serif text-3xl md:text-5xl tracking-[0.3em] text-foreground flex items-center gap-4">
      {["25", "11", "25"].map((segment, i) => (
        <motion.span
          key={`${theme}-${i}`}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={dateSegmentVariants}
        >
          {segment}
          {i < 2 && <span className="mx-4">·</span>}
        </motion.span>
      ))}
    </div>
  );
}
