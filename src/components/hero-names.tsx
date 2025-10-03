"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function HeroNames() {
  const prefersReducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isHersTheme = mounted && theme === "hers";

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const transition = {
    duration: prefersReducedMotion ? 0.01 : 0.8,
    ease: [0.43, 0.13, 0.23, 0.96] as const,
    delay: 0.5,
  };

  return (
    <motion.div
      key={`names-${theme}`}
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={transition}
    >
      <h1 className="font-serif text-6xl md:text-7xl xl:text-8xl text-accent leading-tight flex flex-col items-center">
        <span>{isHersTheme ? "Bhanvi" : "Eshlok"}</span>
        <span>&</span>
        <span>{isHersTheme ? "Eshlok" : "Bhanvi"}</span>
      </h1>
    </motion.div>
  );
}
