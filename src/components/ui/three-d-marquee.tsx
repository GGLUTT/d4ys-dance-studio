"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface ThreeDMarqueeProps {
  images: string[];
  className?: string;
}

export function ThreeDMarquee({ images, className }: ThreeDMarqueeProps) {
  const chunkSize = Math.ceil(images.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return images.slice(start, start + chunkSize);
  });

  return (
    <div
      className={cn(
        "mx-auto flex h-[600px] md:h-[800px] w-full max-w-7xl items-center justify-center overflow-hidden [perspective:400px]",
        className
      )}
    >
      <div
        style={{
          transform: "rotateX(25deg) rotateY(-10deg) rotateZ(5deg) scale(1.2)",
        }}
        className="relative flex gap-4 md:gap-6"
      >
        {chunks.map((chunk, colIndex) => (
          <motion.div
            key={colIndex}
            className="flex flex-col gap-4 md:gap-6"
            animate={{
              y: colIndex % 2 === 0 ? [0, -400] : [-400, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Duplicate for seamless loop */}
            {[...chunk, ...chunk].map((image, imgIndex) => (
              <motion.div
                key={`${colIndex}-${imgIndex}`}
                className="relative h-32 w-24 md:h-48 md:w-36 overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05, zIndex: 10 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={image}
                  alt={`Gallery image ${imgIndex + 1}`}
                  className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
