"use client";
import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid } from "@/components/ui/layout-grid";

// Import grid images
import gridHiphop from "@/assets/grid-hiphop.jpg";
import gridKpop from "@/assets/grid-kpop.jpg";
import gridHeels from "@/assets/grid-heels.jpg";
import gridChoreo from "@/assets/grid-choreo.jpg";

const SkeletonOne = () => {
  return (
    <div className="relative z-50 flex flex-col justify-end h-full p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md mb-3">
          Most Popular
        </div>
        <p className="font-black text-3xl md:text-5xl text-white uppercase tracking-tighter drop-shadow-lg">
          Hip-Hop
        </p>
        <p className="font-medium text-base md:text-lg text-white/90 mt-2 max-w-xs drop-shadow-md leading-relaxed">
          Rhythm, street culture, freestyle. Feel the groove and express yourself.
        </p>
      </motion.div>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div className="relative z-50 flex flex-col justify-end h-full p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md mb-3">
          Trending
        </div>
        <p className="font-black text-2xl md:text-4xl text-white uppercase tracking-tighter drop-shadow-lg">
          K-Pop
        </p>
        <p className="font-medium text-sm md:text-base text-white/90 mt-2 drop-shadow-md leading-relaxed">
          Cover dance, energy, precision. Master the moves of your favorite artists.
        </p>
      </motion.div>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div className="relative z-50 flex flex-col justify-end h-full p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md mb-3">
          For Ladies
        </div>
        <p className="font-black text-2xl md:text-4xl text-white uppercase tracking-tighter drop-shadow-lg">
          Heels / Jazz-Funk
        </p>
        <p className="font-medium text-sm md:text-base text-white/90 mt-2 drop-shadow-md leading-relaxed">
          Femininity, plasticity, confidence. Dance on heels like a pro.
        </p>
      </motion.div>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div className="relative z-50 flex flex-col justify-end h-full p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md mb-3">
          Professional
        </div>
        <p className="font-black text-3xl md:text-5xl text-white uppercase tracking-tighter drop-shadow-lg">
          Choreography
        </p>
        <p className="font-medium text-base md:text-lg text-white/90 mt-2 max-w-xs drop-shadow-md leading-relaxed">
          Author's choreography, performance. Create your own unique style.
        </p>
      </motion.div>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2 min-h-[300px]",
    thumbnail: gridHiphop,
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1 min-h-[250px]",
    thumbnail: gridKpop,
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1 min-h-[250px]",
    thumbnail: gridHeels,
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2 min-h-[300px]",
    thumbnail: gridChoreo,
  },
];

export const DirectionsSection = () => {
  return (
    <section id="directions" className="relative min-h-screen bg-background py-20">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16 sm:mb-24 section-container"
      >
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold uppercase tracking-widest text-primary mb-6"
        >
          Directions
        </motion.span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-foreground">
          Обери свій <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">стиль</span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Ми пропонуємо різноманітні танцювальні напрямки для всіх рівнів підготовки. 
          Знайди те, що запалює саме тебе.
        </p>
      </motion.div>

      {/* Layout Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <LayoutGrid cards={cards} />
      </motion.div>
    </section>
  );
};
