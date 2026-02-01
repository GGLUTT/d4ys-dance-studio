"use client";
import React from "react";
import { motion } from "framer-motion";
import { ThreeDMarquee } from "@/components/ui/three-d-marquee";

// Import gallery images
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";

const galleryImages = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
  gallery1,
  gallery3,
  gallery5,
  gallery7,
];

export const GallerySection = () => {
  return (
    <section id="gallery" className="relative min-h-screen bg-background py-20 overflow-hidden">
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent z-10" />
      
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-20 text-center mb-16 sm:mb-24"
      >
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold uppercase tracking-widest text-primary mb-6"
        >
          Атмосфера
        </motion.span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-foreground">
          Відчуй нашу <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">енергію</span>
        </h2>
      </motion.div>

      {/* 3D Marquee */}
      <ThreeDMarquee images={galleryImages} />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
