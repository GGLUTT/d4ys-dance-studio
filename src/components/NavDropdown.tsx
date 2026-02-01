"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface NavItem {
    name: string;
    link: string;
}

interface NavDropdownProps {
    items: NavItem[];
    activeSection: string;
    onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, link: string) => void;
}

export const NavDropdown = ({ items, activeSection, onNavigate }: NavDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Animation variants for the dropdown container
    const dropdownVariants = {
        closed: {
            opacity: 0,
            y: 8,
            scale: 0.98,
            transition: {
                staggerChildren: 0.02,
                staggerDirection: -1,
                when: "afterChildren",
                duration: 0.15,
                ease: "easeOut"
            },
        },
        open: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                duration: 0.2,
                staggerChildren: 0.03,
                delayChildren: 0.05,
            },
        },
    };

    // Animation variants for individual items
    const itemVariants = {
        closed: { opacity: 0, x: -8, transition: { duration: 0.1 } },
        open: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    };

    // Check if any child item is active
    const isAnyChildActive = items.some(
        (item) => activeSection === item.link.replace("#", "")
    );

    return (
        <div className="relative" ref={containerRef}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative flex items-center gap-1.5 px-5 py-2.5 rounded-full transition-all duration-300 group",
                    isAnyChildActive
                        ? "text-foreground bg-white/5 shadow-sm border border-white/10"
                        : "text-foreground/80 hover:text-foreground hover:bg-white/5 active:scale-95"
                )}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <span className="relative z-10 text-sm font-bold uppercase tracking-widest">
                    More
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                >
                    <ChevronDown className="w-4 h-4 text-foreground/70 group-hover:text-foreground transition-colors" />
                </motion.div>

                {/* Active indicator for parent button if a child is active */}
                {isAnyChildActive && (
                    <motion.div
                        layoutId="active-indicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary glow-red"
                        transition={{ duration: 0.3 }}
                    />
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={dropdownVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="absolute top-full right-0 mt-3 w-56 p-2 rounded-2xl glass-dark shadow-2xl border border-white/10 backdrop-blur-2xl overflow-hidden flex flex-col"
                        style={{ originY: 0, originX: 1 }}
                    >
                        {items.map((item) => {
                            const isActive = activeSection === item.link.replace("#", "");
                            return (
                                <motion.a
                                    key={item.name}
                                    href={item.link}
                                    variants={itemVariants}
                                    onClick={(e) => {
                                        setIsOpen(false);
                                        onNavigate(e, item.link);
                                    }}
                                    whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        "relative w-full px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors text-left flex items-center gap-3",
                                        isActive
                                            ? "text-primary bg-primary/10"
                                            : "text-foreground/70 hover:text-foreground"
                                    )}
                                >
                                    {/* Small Dot Indicator for all items, active glows */}
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                        isActive ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" : "bg-white/20 group-hover:bg-white/40"
                                    )} />

                                    {item.name}
                                </motion.a>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
