"use client";

import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

interface ProductGridProps {
    products: Product[];
    title?: string;
    /** If true, renders a search bar that client-side filters the passed products. */
    searchable?: boolean;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function ProductGrid({ products, title, searchable = false }: ProductGridProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Case-insensitive filter using useMemo — no extra fetches on keystroke.
    const filtered = useMemo(() => {
        if (!searchTerm.trim()) return products;
        const q = searchTerm.toLowerCase();
        return products.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                (p.brand ?? "").toLowerCase().includes(q) ||
                (p.description ?? "").toLowerCase().includes(q)
        );
    }, [searchTerm, products]);

    if (!products?.length) return null;

    return (
        <section className="py-12">
            {title && (
                <h2 className="text-3xl font-bold tracking-tight mb-8">
                    {title}
                </h2>
            )}

            {searchable && (
                <div className="relative mb-12 max-w-lg">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Filter products..."
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-full pl-12 pr-6 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    />
                </div>
            )}

            {filtered.length === 0 && (
                <p className="text-white/40 text-sm tracking-wider py-12 text-center">
                    No products match &quot;{searchTerm}&quot;
                </p>
            )}

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
            >
                {filtered.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
