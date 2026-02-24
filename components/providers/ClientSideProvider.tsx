"use client";

import dynamic from "next/dynamic";

// All heavy client-only chrome loaded after first paint — ssr:false keeps SSR bundle clean
const Navbar = dynamic(
    () => import("@/components/ui/Navbar").then((m) => m.Navbar),
    { ssr: false }
);
const CartDrawer = dynamic(
    () => import("@/components/cart/CartDrawer").then((m) => m.CartDrawer),
    { ssr: false }
);
const IntelligentCursor = dynamic(
    () => import("@/components/ui/IntelligentCursor").then((m) => m.IntelligentCursor),
    { ssr: false }
);

export function ClientSideProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* GPU-composited custom cursor — never SSR'd */}
            <IntelligentCursor />
            {/* Sticky nav — needs Framer scroll hooks (client only) */}
            <Navbar />
            {/* Cart drawer — needs Zustand store (client only) */}
            <CartDrawer />
            {children}
        </>
    );
}
