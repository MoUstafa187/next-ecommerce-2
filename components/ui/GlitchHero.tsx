"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import Link from "next/link";

const HERO_LINES = ["BEYOND", "LOGIC."];

// Glitch text layer — renders two offset copies with clip-path animations
function GlitchText({ text, className }: { text: string; className?: string }) {
    const [active, setActive] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setActive(true);
            setTimeout(() => setActive(false), 500);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className={`relative inline-block ${className ?? ""}`}>
            {text}
            {active && (
                <>
                    <span
                        aria-hidden
                        className="absolute inset-0 text-[#00ffff]"
                        style={{
                            animation: "glitch-1 0.4s steps(4) forwards",
                            clipPath: "inset(10% 0 85% 0)",
                        }}
                    >
                        {text}
                    </span>
                    <span
                        aria-hidden
                        className="absolute inset-0 text-[#ff00ff]"
                        style={{
                            animation: "glitch-2 0.4s steps(4) forwards",
                            clipPath: "inset(70% 0 10% 0)",
                        }}
                    >
                        {text}
                    </span>
                </>
            )}
        </span>
    );
}

export function GlitchHero() {
    const heroRef = useRef<HTMLElement>(null);
    const [booted, setBooted] = useState(false);

    // Motion values — mutated directly, no React re-render on mouse move
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    const geoX = useTransform(mouseX, [0, 1], [-12, 12]);
    const geoY = useTransform(mouseY, [0, 1], [-6, 6]);
    const gridY = useTransform(mouseY, [0, 1], [-5, 5]);
    const textX = useTransform(mouseX, [0, 1], [-4, 4]);
    const textY = useTransform(mouseY, [0, 1], [-2, 2]);

    useEffect(() => {
        const t = setTimeout(() => setBooted(true), 600);
        return () => clearTimeout(t);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    }, [mouseX, mouseY]);

    return (
        <section
            ref={heroRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
            style={{ perspective: "1200px" }}
        >
            {/* Animated grid floor — motion.div so parallax bypasses React render */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        `linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                    maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)",
                    y: gridY,
                    willChange: "transform",
                }}
            />

            {/* Spinning geometry — motion.div for zero-render parallax */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                    x: geoX,
                    y: geoY,
                    willChange: "transform",
                }}
            >
                <div className="w-[700px] h-[700px] border border-white/[0.03] rounded-full animate-[spin_120s_linear_infinite]" />
                <div className="absolute w-[500px] h-[500px] border border-[#00ffff]/10 rounded-full animate-[spin_80s_linear_infinite_reverse]" />
                <div className="absolute w-[300px] h-[300px] border border-[#ff00ff]/8 rounded-full animate-[spin_40s_linear_infinite]" />
                <div className="absolute w-[1px] h-[600px] bg-gradient-to-b from-transparent via-[#00ffff]/20 to-transparent rotate-45 animate-[spin_30s_linear_infinite]" />
                <div className="absolute w-[1px] h-[600px] bg-gradient-to-b from-transparent via-[#ff00ff]/15 to-transparent -rotate-12 animate-[spin_50s_linear_infinite_reverse]" />
            </motion.div>

            {/* Scanlines */}
            <div className="scanlines absolute inset-0 pointer-events-none z-0" />

            {/* Main hero content — motion.div for zero-render parallax */}
            <motion.div
                className="relative z-10 text-center px-4"
                style={{
                    x: textX,
                    y: textY,
                    willChange: "transform",
                }}
            >
                {/* Boot sequence badge */}
                <AnimatePresence>
                    {booted && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 border border-[#00ffff]/30 rounded-full text-[10px] tracking-[0.4em] text-[#00ffff]/70 uppercase font-mono"
                            style={{ boxShadow: "0 0 20px rgba(0,255,255,0.1)" }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffff] animate-pulse shadow-[0_0_8px_#00ffff]" />
                            SYSTEM INITIALIZED — 2040.02.24
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hero headline */}
                <h1 className="font-playfair font-black leading-[0.82] tracking-tighter select-none"
                    style={{ fontSize: "clamp(5rem, 16vw, 14rem)" }}>
                    {HERO_LINES.map((line, i) => (
                        <motion.div
                            key={line}
                            initial={{ opacity: 0, y: 60, rotateX: -30 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ delay: 0.3 + i * 0.25, type: "spring", stiffness: 80, damping: 15 }}
                            className="block"
                        >
                            <GlitchText
                                text={line}
                                className={i === 1 ? "holo-text" : "text-white"}
                            />
                        </motion.div>
                    ))}
                </h1>

                {/* Sub-copy */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-8 text-white/30 text-sm md:text-xl tracking-[0.15em] max-w-2xl mx-auto font-sans"
                >
                    The spatial manifestation of absolute digital luxury.<br />
                    Aggressive interaction models. Zero latency.
                </motion.p>

                {/* CTA row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.6 }}
                    className="mt-14 flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                    <Link href="#vault" scroll>
                        <MagneticButton
                            className="h-14 px-10 text-xs tracking-[0.4em] font-black uppercase bg-[#00ffff] text-black hover:bg-white transition-colors duration-300"
                            style={{ boxShadow: "0 0 40px rgba(0,255,255,0.4)" } as React.CSSProperties}
                        >
                            ENTER THE VAULT
                        </MagneticButton>
                    </Link>
                    <MagneticButton
                        className="h-14 px-10 text-xs tracking-[0.4em] font-black uppercase border border-white/20 bg-transparent text-white glass-2 hover:border-[#00ffff]/50"
                    >
                        READ MANIFEST
                    </MagneticButton>
                </motion.div>
            </motion.div>

            {/* Corner coordinates */}
            <div className="absolute bottom-8 left-8 text-[9px] tracking-[0.5em] text-white/15 font-mono">
                COORD: [0x4A, 0x9F, 0x22]
            </div>
            <div className="absolute bottom-8 right-8 text-[9px] tracking-[0.5em] text-white/15 font-mono">
                SECTOR: 001 / 003
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
                <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent" />
                <p className="text-[9px] tracking-[0.5em] text-white/25 uppercase">SCROLL</p>
            </motion.div>
        </section>
    );
}
