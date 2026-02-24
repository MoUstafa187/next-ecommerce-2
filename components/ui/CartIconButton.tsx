"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { RollingNumber } from "./RollingNumber";
import { useState, useEffect } from "react";

export function CartIconButton() {
    const items = useCartStore((state) => state.items);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    if (!mounted) {
        return (
            <button className="relative p-2 text-white flex items-center space-x-2 rounded-full glass-2 hover:bg-white hover:text-black">
                <ShoppingCart className="h-5 w-5" />
            </button>
        );
    }

    return (
        <button
            onClick={() => useCartStore.getState().openCart()}
            className="relative p-2 text-white hover:text-black transition-colors flex items-center space-x-2 group rounded-full glass-2 hover:bg-white"
        >
            <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-black text-[10px] font-bold tabular-nums border border-black group-hover:bg-black group-hover:text-white">
                    <RollingNumber value={itemCount} />
                </span>
            )}
        </button>
    );
}
