"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "exit">("loading");

  useEffect(() => {
    // Faster, smoother loading duration
    const duration = 2200;
    const interval = 20;
    // Non-linear increment for more natural feel
    let currentProgress = 0;

    const timer = setInterval(() => {
      // Simulate network stutter/bursts for realism
      const increment = (100 / (duration / interval)) * (Math.random() * 1.5 + 0.5);

      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(timer);
        setPhase("reveal");
        // Hold the "100%" for a split second before exiting
        setTimeout(() => {
          setPhase("exit");
          // Allow exit animation to play before unmounting
          setTimeout(onComplete, 1000);
        }, 600);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  const containerVariants = {
    exit: {
      y: "-100vh",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1], // Custom bezier for "heavy curtain" feel
        delay: 0.1,
      },
    },
  };

  const letterParentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: {
      y: 40,
      opacity: 0,
      filter: "blur(10px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const letters = ["D", "4", "Y", "S"];

  return (
    <AnimatePresence mode="wait">
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
          variants={containerVariants}
          exit="exit"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            {/* Subtle Grid */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                                  linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                backgroundSize: "80px 80px",
              }}
            />

            {/* Central Vignette / Spotlight */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-background/50 to-background opacity-80" />
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                background: [
                  "radial-gradient(circle at 50% 50%, hsl(var(--primary)) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 50%, hsl(var(--primary)) 0%, transparent 60%)",
                  "radial-gradient(circle at 50% 50%, hsl(var(--primary)) 0%, transparent 50%)",
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center">

            {/* Logo Text */}
            <motion.div
              className="flex items-center mb-12 overflow-hidden"
              variants={letterParentVariants}
              initial="hidden"
              animate="visible"
            >
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  variants={letterVariants}
                  className={`text-6xl sm:text-9xl font-black tracking-tighter ${letter === "4" ? "text-primary relative" : "text-foreground"
                    }`}
                >
                  {letter}
                  {/* Subtle Glow for the '4' */}
                  {letter === "4" && (
                    <motion.div
                      className="absolute inset-0 blur-2xl bg-primary/20 -z-10"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.span>
              ))}
            </motion.div>

            {/* Progress Container */}
            <div className="w-64 sm:w-80 relative">
              {/* Progress Text Floating Above */}
              <div className="flex justify-between items-end mb-2 px-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                  Loading
                </span>
                <span className="text-xl font-mono font-medium text-foreground tabular-nums">
                  {Math.round(progress).toString().padStart(3, '0')}
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="h-[2px] w-full bg-primary/10 overflow-hidden relative">
                <motion.div
                  className="h-full bg-primary relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 20, mass: 0.5 }}
                >
                  {/* Leading Edge Glow */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-20 h-20 bg-primary/30 blur-xl rounded-full" />
                  <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]" />
                </motion.div>
              </div>
            </div>

          </div>

          {/* Decorative Corner Lines */}
          <div className="absolute top-0 left-0 p-8 opacity-20 hidden sm:block">
            <div className="w-[1px] h-24 bg-foreground/50" />
            <div className="h-[1px] w-24 bg-foreground/50 -mt-[1px]" />
          </div>
          <div className="absolute bottom-0 right-0 p-8 opacity-20 hidden sm:block">
            <div className="w-[1px] h-24 bg-foreground/50 absolute bottom-8 right-8" />
            <div className="h-[1px] w-24 bg-foreground/50 absolute bottom-8 right-8" />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
