"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Hover 3.5D Tilt Physics
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 400, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 400, damping: 25 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [25, -25]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-25, 25]);

    // Dynamic Shadow tracking
    const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [40, -40]);
    const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [40, -40]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        // Image Pre-fetching (Zero Lag Architecture)
        product.images.forEach((src) => {
            const img = new window.Image();
            img.src = src;
        });
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem(product);
        toast.success(`${product.title} added to cart`);
    };

    return (
        <div className="group perspective-[1500px] z-10 hover:z-50 focus-within:z-50 relative pointer-events-auto flex flex-col">
            <Link href={`/products/${product.id}`} className="block">
                <motion.div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseEnter}
                    animate={{
                        scale: isHovered ? 1.05 : 1,
                        zIndex: isHovered ? 100 : 1,
                    }}
                    style={{
                        rotateX: isHovered ? rotateX : 0,
                        rotateY: isHovered ? rotateY : 0,
                        transformStyle: "preserve-3d",
                        boxShadow: isHovered ? `${shadowX.get()}px ${shadowY.get()}px 60px rgba(0,0,0,0.8)` : "0px 10px 30px rgba(0,0,0,0.5)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative glass-2 rounded-2xl p-4 transition-colors duration-500 glow-stroke"
                >
                    {/* Refractive Overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ transform: "translateZ(30px)" }} />

                    <div
                        className="relative aspect-[4/5] overflow-hidden rounded-xl bg-black mb-4 border border-white/5"
                        style={{ transform: "translateZ(80px)" }}
                    >
                        <Image
                            src={product.images[0] || product.thumbnail}
                            alt={product.title}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover object-center transition-transform duration-1000 group-hover:scale-[1.15]"
                        />
                        <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-transparent" />
                    </div>

                    <div className="flex flex-col space-y-1" style={{ transform: "translateZ(50px)" }}>
                        <h3 className="font-playfair font-bold text-xl text-white leading-tight truncate">
                            {product.title}
                        </h3>
                        <p className="text-xs font-sans text-[#a1a1aa] tracking-[0.2em]">{product.brand || product.category}</p>
                        <p className="font-sans font-bold text-lg text-white tabular-nums">
                            ${product.price.toFixed(2)}
                        </p>
                    </div>
                </motion.div>
            </Link>

            {/* Add to Cart — outside Link to prevent nested interactive element */}
            <button
                type="button"
                onClick={handleAddToCart}
                className="mt-3 w-full h-11 bg-white text-black hover:bg-white/90 active:scale-95 font-bold tracking-widest uppercase text-[10px] border border-black transition-all duration-200 glow-stroke cursor-pointer"
            >
                ADD TO CARGO
            </button>
        </div>
    );
}

