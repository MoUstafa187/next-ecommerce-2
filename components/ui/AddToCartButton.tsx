"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AddToCartButtonProps {
    product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);
    const openCart = useCartStore((state) => state.openCart);
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; rotate: number; scale: number; color: string }[]>([]);

    const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
        addItem(product);
        openCart(); // Auto open drawer for high-end feel
        toast.success(`${product.title} cargo secured`, {
            description: "Initializing checkout sequence.",
            icon: "🌌"
        });

        // Trigger particle explosion
        const newParticles = Array.from({ length: 15 }).map((_, i) => ({
            id: Date.now() + i,
            x: (Math.random() - 0.5) * 200, // random spread X
            y: (Math.random() - 0.5) * 200, // random spread Y
            rotate: Math.random() * 360,
            scale: Math.random() * 1.5 + 0.5,
            color: Math.random() > 0.5 ? "#ffffff" : "#a1a1aa" // Space colors
        }));

        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1000);
    };

    return (
        <div className="relative w-full">
            <Button size="lg" className="w-full text-base bg-white text-black hover:bg-white/90 relative overflow-hidden group" onClick={handleAdd}>
                <span className="relative z-10 flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    ADD TO CARGO
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-black/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Button>

            {/* Particle Explosion Layer */}
            <div className="absolute top-1/2 left-1/2 pointer-events-none z-50">
                <AnimatePresence>
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                            animate={{
                                x: p.x,
                                y: p.y,
                                opacity: 0,
                                scale: p.scale,
                                rotate: p.rotate
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute w-2 h-2 rounded-full"
                            style={{ backgroundColor: p.color }}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
