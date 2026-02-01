"use client";
import React from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { Instagram, MapPin, Clock } from "lucide-react";

export const FooterSection = () => {
  return (
    <footer id="contact" className="relative min-h-[80vh] bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Large background text */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[15vw] md:text-[12vw] font-black uppercase tracking-tighter text-muted/30 whitespace-nowrap">
          Bila Tserkva
        </span>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-12 px-4">
        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm uppercase tracking-widest">Ukraine</span>
          </div>
          <h2 className="heading-xl text-foreground">
            D4YS <span className="text-gradient-red">STUDIO</span>
          </h2>
        </motion.div>

        {/* Schedule hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 text-muted-foreground"
        >
          <Clock className="h-4 w-4" />
          <span className="text-sm uppercase tracking-widest">Check schedule on Instagram</span>
        </motion.div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <MagneticButton href="https://www.instagram.com/d4ys_studio/">
            <Instagram className="h-5 w-5" />
            <span>Follow Us</span>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="absolute bottom-0 left-0 right-0 border-t border-border/20 py-6"
      >
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground uppercase tracking-widest">
          <span>© 2026 D4YS Studio by GGLUTT</span>
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-foreground transition-colors">Home</a>
            <a href="#gallery" className="hover:text-foreground transition-colors">Gallery</a>
            <a href="#directions" className="hover:text-foreground transition-colors">Directions</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};
