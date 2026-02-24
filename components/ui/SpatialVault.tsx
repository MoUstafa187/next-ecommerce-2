"use client";

import { useRef, useState, useEffect, memo, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

interface SpatialVaultProps {
    products: Product[];
}

// Pre-compute static slot data — stable across renders
function computeSlots(total: number, radius: number) {
    return Array.from({ length: total }, (_, i) => {
        const baseAngle = (i / total) * 2 * Math.PI;
        return { i, baseAngle };
    });
}

// ─── HoloCard — memoized, receives only stable product prop ──────────────────
const HoloCard = memo(function HoloCard({ product }: { product: Product }) {
    const addItem = useCartStore((s) => s.addItem);
    const [hovered, setHovered] = useState(false);
    const [glitching, setGlitching] = useState(false);

    const handleAddToCart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        setGlitching(true);
        toast.success(`${product.title} — ACQUIRED`, {
            description: `$${product.price.toFixed(2)} charged to your neural wallet`,
        });
        setTimeout(() => setGlitching(false), 500);
    }, [addItem, product]);

    return (
        <div
            className="w-[180px] sm:w-[200px]"
            style={{ willChange: "transform, opacity" }}
            onMouseEnter={() => { setHovered(true); setGlitching(true); setTimeout(() => setGlitching(false), 350); }}
            onMouseLeave={() => setHovered(false)}
        >
            <Link href={`/products/${product.id}`} className="block group">
                <div
                    className="relative rounded-2xl overflow-hidden bg-black/70 transition-shadow duration-300"
                    style={{
                        boxShadow: hovered
                            ? "0 0 50px rgba(0,255,255,0.3), 0 0 100px rgba(0,255,255,0.08), inset 0 0 0 1px rgba(0,255,255,0.45)"
                            : "0 0 15px rgba(255,255,255,0.03), inset 0 0 0 1px rgba(255,255,255,0.07)",
                        // Single cheap backdrop-blur only when hovered so resting cards don't paint
                    }}
                >
                    {/* Glitch scanlines — CSS only, no JS animation loop */}
                    <div
                        className="absolute inset-0 z-30 pointer-events-none rounded-2xl transition-opacity duration-100"
                        style={{
                            opacity: glitching ? 1 : 0,
                            backgroundImage:
                                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.09) 2px, rgba(0,255,255,0.09) 4px)",
                            mixBlendMode: "screen",
                        }}
                    />

                    {/* Neon corner brackets — CSS opacity, not mount/unmount */}
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#00ffff] z-20 pointer-events-none transition-opacity duration-200"
                        style={{ opacity: hovered ? 1 : 0 }} />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#00ffff] z-20 pointer-events-none transition-opacity duration-200"
                        style={{ opacity: hovered ? 1 : 0 }} />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#00ffff] z-20 pointer-events-none transition-opacity duration-200"
                        style={{ opacity: hovered ? 1 : 0 }} />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#00ffff] z-20 pointer-events-none transition-opacity duration-200"
                        style={{ opacity: hovered ? 1 : 0 }} />

                    {/* Image */}
                    <div className="aspect-[3/4] relative overflow-hidden">
                        <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            sizes="200px"
                            className="object-cover transition-transform duration-700"
                            style={{
                                transform: hovered ? "scale(1.12)" : "scale(1)",
                                filter: hovered ? "saturate(1.5)" : "saturate(0.6)",
                            }}
                        />
                        {/* Holographic shimmer — opacity only, GPU composited */}
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                            style={{
                                opacity: hovered ? 1 : 0,
                                background:
                                    "linear-gradient(135deg, transparent 0%, rgba(0,255,255,0.07) 35%, rgba(255,0,255,0.07) 65%, transparent 100%)",
                                mixBlendMode: "screen",
                            }}
                        />
                        {/* Price badge */}
                        <div className="absolute top-2 right-2 bg-black/80 border border-white/15 px-2 py-0.5 rounded text-[10px] font-mono text-white tracking-widest">
                            ${product.price.toFixed(2)}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                        <p className="text-[10px] tracking-[0.2em] uppercase mb-1 transition-colors duration-200"
                            style={{ color: hovered ? "#00ffff" : "rgba(255,255,255,0.3)" }}>
                            {product.category}
                        </p>
                        <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 font-playfair">
                            {product.title}
                        </h3>
                    </div>
                </div>
            </Link>

            {/* ACQUIRE button — opacity/transform only, pointer-events gated */}
            <button
                type="button"
                onClick={handleAddToCart}
                className="w-full mt-2 h-9 bg-[#00ffff] text-black text-[10px] font-black tracking-[0.3em] uppercase
                    transition-all duration-200 hover:bg-white"
                style={{
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
                    pointerEvents: hovered ? "auto" : "none",
                    willChange: "transform, opacity",
                    boxShadow: "0 0 18px rgba(0,255,255,0.5)",
                }}
            >
                ACQUIRE
            </button>
        </div>
    );
});

// ─── SpatialVault — rAF drives refs, never calls setState on each frame ───────
export function SpatialVault({ products }: SpatialVaultProps) {
    const count = Math.min(products.length, 12);
    const containerRef = useRef<HTMLDivElement>(null);

    // Rotation stored in a ref — mutated by rAF without triggering re-renders
    const rotationRef = useRef(0);
    const dragging = useRef(false);
    const dragStart = useRef<{ x: number; r: number } | null>(null);

    // One motion value per card for x, y, opacity, scale — Framer drives DOM directly
    const cardMotionValues = useRef(
        Array.from({ length: count }, () => ({
            x: useMotionValue(0),
            y: useMotionValue(0),
            opacity: useMotionValue(1),
            scale: useMotionValue(1),
        }))
    );

    // Compute radius client-side once
    const radius = useRef(340);
    useEffect(() => {
        radius.current = Math.min(window.innerWidth * 0.38, 420);
    }, []);

    // rAF loop — writes directly to motion values, zero React re-renders
    useEffect(() => {
        let raf: number;
        const tick = () => {
            if (!dragging.current) {
                rotationRef.current += 0.0007;
            }
            const r = rotationRef.current;
            const rad = radius.current;

            for (let i = 0; i < count; i++) {
                const angle = (i / count) * 2 * Math.PI + r;
                const x = Math.cos(angle) * rad;
                const y = Math.sin(angle) * rad * 0.44;
                const depth = Math.cos(angle); // -1..1
                const sc = 0.72 + depth * 0.1;
                const op = 0.38 + (depth + 1) * 0.31;

                const mv = cardMotionValues.current[i];
                mv.x.set(x);
                mv.y.set(y);
                mv.scale.set(sc);
                mv.opacity.set(op);
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [count]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current || !dragging.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        if (dragStart.current) {
            const delta = (e.clientX - dragStart.current.x) / rect.width;
            rotationRef.current = dragStart.current.r + delta * Math.PI * 2;
        }
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        dragStart.current = { x: e.clientX, r: rotationRef.current };
        dragging.current = true;
    }, []);

    const handleMouseUp = useCallback(() => {
        dragging.current = false;
        dragStart.current = null;
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full select-none"
            style={{ height: "680px", perspective: "1200px", cursor: "grab" }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Orbit rings — pure CSS, no JS */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className="rounded-full border border-white/[0.04] animate-[spin_80s_linear_infinite]"
                    style={{ width: "78%", height: "42%", transform: "rotateX(75deg)", willChange: "transform" }}
                />
                <div
                    className="absolute rounded-full border border-[#00ffff]/[0.07] animate-[spin_52s_linear_infinite_reverse]"
                    style={{ width: "58%", height: "32%", transform: "rotateX(75deg)", willChange: "transform" }}
                />
            </div>

            {/* Center orb */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-[#00ffff] shadow-[0_0_24px_#00ffff,0_0_70px_rgba(0,255,255,0.35)]" />
            </div>

            {/* Cards — each driven by its own motion values */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
                {products.slice(0, count).map((product, i) => {
                    const mv = cardMotionValues.current[i];
                    return (
                        <motion.div
                            key={product.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{
                                x: mv.x,
                                y: mv.y,
                                scale: mv.scale,
                                opacity: mv.opacity,
                                willChange: "transform, opacity",
                                zIndex: i,
                            }}
                        >
                            <HoloCard product={product} />
                        </motion.div>
                    );
                })}
            </div>

            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/15 text-[10px] tracking-[0.4em] uppercase pointer-events-none font-mono">
                DRAG TO ROTATE VAULT
            </p>
        </div>
    );
}
