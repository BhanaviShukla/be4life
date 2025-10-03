"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";

export function LeftSilhouette() {
  const prefersReducedMotion = useReducedMotion();
  const { theme } = useTheme();

  const silhouetteVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  const transition = {
    duration: prefersReducedMotion ? 0.01 : 1.2,
    ease: [0.43, 0.13, 0.23, 0.96] as const,
  };

  return (
    <motion.div
      className="absolute left-0 bottom-0 w-[57vw] h-[73vh] md:w-[52vw] md:h-[83vh] lg:w-[55vw] lg:h-[86vh] pointer-events-none"
      key={`left-${theme}`}
      initial="hidden"
      animate="visible"
      variants={silhouetteVariants}
      transition={transition}
    >
      <div className="relative w-full h-full">
        <Image
          src="/motifs/woman-bottom-left.png"
          alt=""
          fill
          className="object-contain object-bottom-left"
          loading="eager"
          priority
        />
      </div>
    </motion.div>
  );
}

export function RightSilhouette() {
  const prefersReducedMotion = useReducedMotion();
  const { theme } = useTheme();

  const silhouetteVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  };

  const transition = {
    duration: prefersReducedMotion ? 0.01 : 1.2,
    ease: [0.43, 0.13, 0.23, 0.96] as const,
  };

  return (
    <motion.div
      className="absolute right-0 bottom-0 w-[50vw] h-[70vh] md:w-[45vw] md:h-[80vh] pointer-events-none"
      key={`right-${theme}`}
      initial="hidden"
      animate="visible"
      variants={silhouetteVariants}
      transition={transition}
    >
      <div className="relative w-full h-full">
        <Image
          src="/motifs/man-bottom-right.png"
          alt=""
          fill
          className="object-contain object-bottom-right"
          loading="eager"
          priority
        />
      </div>
    </motion.div>
  );
}
