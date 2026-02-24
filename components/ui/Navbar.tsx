"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import dynamic from "next/dynamic";

const DynamicCartIcon = dynamic(() => import("./CartIconButton").then(m => m.CartIconButton), { ssr: false });

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <div className="fixed top-0 left-0 right-0 z-[90] flex justify-center pt-6 px-4 pointer-events-none">
            <motion.nav
                layout
                initial={{ borderRadius: 0, width: "100%", y: -24 }}
                animate={{
                    borderRadius: isScrolled ? 100 : 0,
                    width: isScrolled ? "800px" : "100%",
                    maxWidth: "100%",
                    y: isScrolled ? 0 : -24,
                    borderColor: isScrolled ? "rgba(255,255,255,0.05)" : "transparent",
                    background: isScrolled ? "rgba(2,2,2,0.4)" : "transparent",
                    backdropFilter: isScrolled ? "blur(40px)" : "blur(0px)"
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="pointer-events-auto border transition-colors flex items-center justify-between px-8 h-20 origin-top overflow-hidden glow-stroke"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent bg-[length:200%_100%] animate-[shimmer_3s_infinite]" />

                <Link href="/" className="relative z-10 text-2xl font-playfair font-bold tracking-widest text-white hover:text-white/80 transition-all uppercase">
                    OB<span className="text-[#a1a1aa]">SIDI</span>AN
                </Link>

                <div className="relative z-10 flex items-center space-x-4">
                    <DynamicCartIcon />
                </div>
            </motion.nav>
        </div>
    );
}
