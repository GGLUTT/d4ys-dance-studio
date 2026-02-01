"use client";
import React from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Reveal animation overlay */}
      <motion.div
        className="fixed inset-0 z-50 pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.1,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "top", background: "hsl(var(--primary))" }}
      />
      <motion.div
        className="fixed inset-0 z-40 pointer-events-none bg-background"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "top" }}
      />
      {children}
    </motion.div>
  );
};
