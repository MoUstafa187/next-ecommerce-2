"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getProductBySlug, getProductsByCategory } from "@/lib/api/products";
import { Product } from "@/types/product";
import { Container } from "@/components/ui/Container";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ProductDetailPage() {
    const params = useParams() as { slug: string };
    const slug = params.slug;

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const { scrollY } = useScroll();
    const titleY = useTransform(scrollY, [0, 1000], [0, 400]);
    const opacityTransform = useTransform(scrollY, [0, 500], [0.1, 0]);

    useEffect(() => {
        async function fetchData() {
            try {
                const prod = await getProductBySlug(slug);
                setProduct(prod);

                const relatedRes = await getProductsByCategory(prod.category, 4);
                setRelatedProducts(relatedRes.products.filter(p => p.id !== prod.id).slice(0, 4));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white/50 tracking-widest text-sm animate-pulse">
                INITIALIZING QUANTUM ASSETS...
            </div>
        );
    }

    if (!product) {
        return notFound();
    }

    // Scroll-Triggered Typography generator
    const renderScrollText = (text: string) => {
        return text.split("").map((char, i) => (
            <motion.span
                key={i}
                initial={{ opacity: 0.1, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.01 }}
            >
                {char}
            </motion.span>
        ));
    };

    return (
        <div className="relative min-h-screen">
            {/* Parallax Background Title */}
            <motion.div
                className="fixed top-1/4 left-1/2 -content-[50%] -translate-x-1/2 w-full text-center pointer-events-none z-0"
                style={{ y: titleY, opacity: opacityTransform }}
            >
                <h1 className="text-[15vw] font-black tracking-tighter text-white whitespace-nowrap opacity-20 filter blur-sm font-playfair uppercase">
                    {product.title}
                </h1>
            </motion.div>

            <Container className="py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-start">
                    {/* Left: Fixed Parallax Image Frame */}
                    <div className="md:col-span-5 lg:col-span-6 md:sticky md:top-32 h-max">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-black/40 border border-white/10 glass-2 glow-stroke">
                            <Image
                                src={product.images[0] || product.thumbnail}
                                alt={product.title}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover object-center mix-blend-screen opacity-90 transition-transform duration-[2s] hover:scale-110"
                            />
                        </div>

                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4 mt-6">
                                {product.images.slice(1, 5).map((img, i) => (
                                    <div key={i} className="aspect-square relative overflow-hidden rounded-xl bg-black/40 border border-white/10 glass-2 hover:border-white/40 transition-colors glow-stroke">
                                        <Image
                                            src={img}
                                            alt={`${product.title} view ${i + 2}`}
                                            fill
                                            sizes="(max-width: 768px) 25vw, 12vw"
                                            className="object-cover object-center mix-blend-screen opacity-80 hover:opacity-100"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Scrollable God Mode Info */}
                    <div className="md:col-span-7 lg:col-span-6 flex flex-col pt-8 md:pt-0 pb-32">
                        <div className="mb-12">
                            <div className="flex items-center space-x-2 text-xs text-[var(--color-mercury-teal)] mb-6 uppercase tracking-[0.3em] font-semibold">
                                <span>{product.category}</span>
                                <span className="text-white/20">—</span>
                                <span>{product.brand || "VOID ASSET"}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 leading-[0.9] font-playfair">
                                {product.title}
                            </h1>
                            <div className="flex items-center space-x-6">
                                <p className="text-4xl font-sans font-bold text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                    ${product.price.toFixed(2)}
                                </p>
                                {product.discountPercentage > 0 && (
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-none text-xs tracking-widest font-bold bg-white text-black uppercase border glass-2">
                                        -{product.discountPercentage}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Scroll Triggered Typograhy Description */}
                        <div className="prose prose-invert prose-xl mb-16 text-white/70 font-sans leading-relaxed tracking-wide">
                            <p className="min-h-[100px]">{renderScrollText(product.description || "")}</p>
                        </div>

                        <div className="mb-16 space-y-6">
                            <AddToCartButton product={product} />

                            <p className="text-xs text-center text-white/50 tracking-[0.2em] flex items-center justify-center space-x-3 uppercase">
                                <span className="inline-block w-2 h-2 bg-[var(--color-mercury-teal)] shadow-[0_0_15px_var(--color-mercury-teal)]" />
                                <span>{product.availabilityStatus}</span>
                            </p>
                        </div>

                        <div className="border-t border-white/10 pt-12 space-y-4 text-xs tracking-widest uppercase text-[#a1a1aa] font-mono">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-white/5 bg-white/[0.02]">
                                    <span className="text-white/50 block mb-2">Dimensions</span>
                                    {product.dimensions?.width}x{product.dimensions?.height}x{product.dimensions?.depth} cm
                                </div>
                                <div className="p-4 border border-white/5 bg-white/[0.02]">
                                    <span className="text-white/50 block mb-2">Mass</span>
                                    {product.weight} kg
                                </div>
                            </div>
                            <div className="p-4 border border-white/5 bg-white/[0.02]">
                                <span className="text-white/50 block mb-2">Protocol</span>
                                {product.warrantyInformation} | {product.returnPolicy}
                            </div>
                            <div className="p-4 border border-white/5 bg-white/[0.02]">
                                <span className="text-white/50 block mb-2">Logistics</span>
                                {product.shippingInformation}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32 border-t border-white/10 pt-24">
                        <h2 className="text-3xl font-playfair font-bold text-center mb-16 uppercase tracking-[0.2em] text-white">Quantum Relatives</h2>
                        <ProductGrid products={relatedProducts} title="" />
                    </div>
                )}
            </Container>
        </div>
    );
}
