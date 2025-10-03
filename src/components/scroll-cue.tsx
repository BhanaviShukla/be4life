"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollCue() {
  const prefersReducedMotion = useReducedMotion();

  const scrollCueVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
    pulse: {
      y: [0, 8, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut" as const,
      },
    },
  };

  const fadeTransition = {
    delay: prefersReducedMotion ? 0 : 1.5,
    duration: prefersReducedMotion ? 0.01 : 0.5,
  };

  return (
    <motion.div
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer bg-background/60 backdrop-blur-sm px-6 py-4 rounded-full"
      initial="hidden"
      animate={prefersReducedMotion ? "visible" : ["visible", "pulse"]}
      variants={scrollCueVariants}
      transition={fadeTransition}
      onClick={() => {
        document.getElementById("rsvp-section")?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <span className="text-sm text-muted-foreground uppercase tracking-wider">Scroll</span>
      <ChevronDown className="w-6 h-6 text-accent" />
    </motion.div>
  );
}
