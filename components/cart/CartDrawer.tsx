"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
    const { isOpen, closeCart, items, removeItem } = useCartStore();

    const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-3xl"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-[#050505] border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        <div className="p-6 flex items-center justify-between border-b border-white/10">
                            <h2 className="font-playfair text-2xl font-bold text-white flex items-center tracking-wide">
                                <ShoppingBag className="mr-3 h-5 w-5" />
                                CARGO
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="h-5 w-5 text-white" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col justify-center items-center text-[#a1a1aa]">
                                    <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
                                    <p className="font-playfair text-lg">Your cargo is empty.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={item.product.id}
                                        className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                                    >
                                        <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-black flex-shrink-0">
                                            <Image
                                                src={item.product.images[0] || item.product.thumbnail}
                                                alt={item.product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <h3 className="font-bold text-white leading-tight mb-1">{item.product.title}</h3>
                                            <p className="text-sm text-[#a1a1aa] mb-2">Qty: {item.quantity}</p>
                                            <div className="mt-auto flex items-center justify-between">
                                                <span className="font-medium tabular-nums text-white">
                                                    $<RollingNumber value={item.product.price * item.quantity} />
                                                </span>
                                                <button
                                                    onClick={() => removeItem(item.product.id)}
                                                    className="text-[#a1a1aa] hover:text-red-400 transition-colors p-1"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-black/50 backdrop-blur-md">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[#a1a1aa] font-medium tracking-wide">SUBTOTAL</span>
                                    <span className="text-2xl font-bold font-playfair text-white tabular-nums">
                                        $<RollingNumber value={subtotal} />
                                    </span>
                                </div>
                                <Button className="w-full h-14 bg-white text-black hover:bg-white/90 text-sm tracking-widest font-bold">
                                    INITIALIZE CHECKOUT
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
