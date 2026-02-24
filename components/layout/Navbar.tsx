"use client";

import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Container } from "@/components/ui/Container";

export function Navbar() {
    const items = useCartStore((state) => state.items);
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-transparent bg-white/70 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
            <Container>
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-6 md:gap-10">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="inline-block font-bold tracking-tight text-xl">
                                NextCommerce.
                            </span>
                        </Link>
                    </div>

                    <div className="flex flex-1 items-center justify-end space-x-6">
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            <div className="relative max-w-sm ml-auto hidden md:block">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                <input
                                    type="search"
                                    placeholder="Search products..."
                                    className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                                />
                            </div>
                        </div>
                        <nav className="flex items-center">
                            <Link href="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="sr-only">Cart</span>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-black text-[10px] font-medium text-white flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </nav>
                    </div>
                </div>
            </Container>
        </header>
    );
}
