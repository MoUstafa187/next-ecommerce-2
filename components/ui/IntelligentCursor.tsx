"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function IntelligentCursor() {
    // Position driven by motion values — no setState per mousemove
    const rawX = useMotionValue(-100);
    const rawY = useMotionValue(-100);
    const springX = useSpring(rawX, { stiffness: 520, damping: 30 });
    const springY = useSpring(rawY, { stiffness: 520, damping: 30 });

    // Cursor appearance — motion values animate directly
    const cursorScale = useMotionValue(1);
    const cursorOpacity = useMotionValue(0.6);
    const cursorSpringScale = useSpring(cursorScale, { stiffness: 400, damping: 22 });

    // Debounce cursor type changes so they don't fire 60x per px
    const typeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastType = useRef<string>("default");

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            rawX.set(e.clientX - 16);
            rawY.set(e.clientY - 16);

            // Throttle element detection to every 4th event (~15/s)
            if (typeTimer.current) return;
            typeTimer.current = setTimeout(() => {
                typeTimer.current = null;
                const target = e.target as HTMLElement;
                let type = "default";
                if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") type = "input";
                else if (target.closest("a, button, [role='button']")) type = "link";
                else if (target.tagName === "IMG" || target.closest("img")) type = "image";

                if (type === lastType.current) return;
                lastType.current = type;

                if (type === "link") { cursorScale.set(1.6); cursorOpacity.set(0.9); }
                else if (type === "image") { cursorScale.set(2.2); cursorOpacity.set(0.5); }
                else if (type === "input") { cursorScale.set(0.4); cursorOpacity.set(1); }
                else { cursorScale.set(1); cursorOpacity.set(0.6); }
            }, 16); // ~60fps for type detection
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        return () => {
            window.removeEventListener("mousemove", onMove);
            if (typeTimer.current) clearTimeout(typeTimer.current);
        };
    }, [rawX, rawY, cursorScale, cursorOpacity]);

    return (
        <motion.div
            className="pointer-events-none fixed top-0 left-0 z-[999] w-8 h-8 rounded-full mix-blend-difference"
            style={{
                x: springX,
                y: springY,
                scale: cursorSpringScale,
                opacity: cursorOpacity,
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.5)",
                willChange: "transform",
            }}
        />
    );
}
