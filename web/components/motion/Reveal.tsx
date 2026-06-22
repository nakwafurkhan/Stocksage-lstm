"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Stagger delay in seconds */
  delay?: number;
  /** Vertical offset to rise from */
  y?: number;
  className?: string;
};

/**
 * Scroll-into-view reveal: fades + rises on first view.
 * Honors the user's reduced-motion preference (no transform when reduced).
 */
export default function Reveal({ children, delay = 0, y = 24, className }: Props) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}
