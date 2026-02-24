"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { searchProducts } from "@/lib/api/products";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";

export function OmniSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const close = useCallback(() => {
        setIsOpen(false);
        setQuery("");
        setResults([]);
        setHasSearched(false);
    }, []);

    // Escape key + body scroll lock
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
            // Auto-focus input
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, close]);

    // Debounced search — 300ms after last keystroke
    useEffect(() => {
        if (!isOpen) return;
        if (!query.trim()) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            setHasSearched(false);
            try {
                const res = await searchProducts(query.trim(), 8);
                setResults(res.products);
            } catch (e) {
                console.error("OmniSearch failed", e);
                setResults([]);
            } finally {
                setIsSearching(false);
                setHasSearched(true);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, isOpen]);

    const noResults = hasSearched && !isSearching && results.length === 0;

    return (
        <>
            {/* Search trigger button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Open search"
                className="relative p-2 text-white transition-all duration-300 group flex items-center justify-center rounded-full glass-2
                    hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:border-[rgba(0,255,255,0.4)] hover:text-[#00ffff] cursor-pointer"
            >
                <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
            </button>

            {/* Full-screen overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="omni-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        // Click backdrop to close
                        onClick={close}
                        className="fixed inset-0 z-[200] flex flex-col items-center pt-[12vh] px-4"
                        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(24px)" }}
                    >
                        {/* Close button — top right */}
                        <button
                            type="button"
                            onClick={close}
                            aria-label="Close search"
                            className="absolute top-6 right-6 p-3 glass-2 rounded-full text-white/60
                                hover:text-white hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:border-[rgba(0,255,255,0.4)]
                                transition-all duration-200 cursor-pointer z-10"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Search input wrapper — stop click from closing overlay */}
                        <motion.div
                            initial={{ y: -30, scale: 0.95, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="w-full max-w-3xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-7 w-7 text-white/30 pointer-events-none" />
                            <input
                                ref={inputRef}
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="ASK THE ORACLE..."
                                className="w-full h-20 bg-black/50 border border-white/20 rounded-full
                                    pl-18 pr-8 text-3xl font-playfair text-white
                                    placeholder:text-white/20
                                    focus:outline-none focus:border-[rgba(0,255,255,0.5)]
                                    focus:shadow-[0_0_30px_rgba(0,255,255,0.15)]
                                    transition-all duration-300"
                                style={{ paddingLeft: "5rem" }}
                            />
                        </motion.div>

                        {/* Hint text */}
                        {!query && (
                            <p className="mt-6 text-white/25 text-xs tracking-[0.3em] uppercase">
                                Type to search • Esc to close
                            </p>
                        )}

                        {/* Loading state */}
                        {isSearching && (
                            <p className="mt-16 text-white/40 font-playfair text-xl animate-pulse tracking-widest">
                                QUANTUM SEARCH IN PROGRESS...
                            </p>
                        )}

                        {/* No results */}
                        {noResults && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-16 text-white/40 font-playfair text-xl tracking-widest text-center"
                            >
                                SCANNING... NO MATCHES FOUND IN THE 2040 DATABASE
                                <br />
                                <span className="text-white/20 text-sm tracking-[0.4em] mt-2 block">
                                    QUERY: &quot;{query}&quot;
                                </span>
                            </motion.p>
                        )}

                        {/* Results grid */}
                        <AnimatePresence>
                            {results.length > 0 && !isSearching && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full max-w-7xl mt-12 overflow-y-auto pb-20 no-scrollbar"
                                    style={{ maxHeight: "60vh" }}
                                >
                                    <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-6">
                                        {results.length} ARTIFACT{results.length !== 1 ? "S" : ""} RECOVERED
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {results.map((product, i) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.04 }}
                                            >
                                                <Link
                                                    href={`/products/${product.id}`}
                                                    onClick={close}
                                                    className="group block glass-2 rounded-xl overflow-hidden border border-white/10
                                                        hover:border-[rgba(0,255,255,0.35)]
                                                        hover:shadow-[0_0_25px_rgba(0,255,255,0.1)]
                                                        transition-all duration-300"
                                                >
                                                    <div className="relative aspect-square overflow-hidden bg-black/40">
                                                        <Image
                                                            src={product.thumbnail}
                                                            alt={product.title}
                                                            fill
                                                            sizes="(max-width: 640px) 50vw, 25vw"
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <div className="p-3">
                                                        <p className="text-white text-sm font-semibold truncate">{product.title}</p>
                                                        <p className="text-white/40 text-xs tracking-widest mt-1">${product.price.toFixed(2)}</p>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
