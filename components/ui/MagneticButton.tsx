"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

export function MagneticButton({ children, className = "", onClick, ...props }: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    // Ripple Effect
    const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);

    const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        // High-strength pull (e.g. amplifying distance by 0.5)
        const middleX = rect.left + rect.width / 2;
        const middleY = rect.top + rect.height / 2;
        const offsetX = (e.clientX - middleX) * 0.3;
        const offsetY = (e.clientY - middleY) * 0.3;
        x.set(offsetX);
        y.set(offsetY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const rippleX = e.clientX - rect.left;
        const rippleY = e.clientY - rect.top;

        setRipples(prev => [...prev, { x: rippleX, y: rippleY, id: Date.now() }]);
        setTimeout(() => {
            setRipples(prev => prev.slice(1));
        }, 800);

        if (onClick) onClick(e);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{ x: springX, y: springY }}
            className={`relative overflow-hidden ${className} glow-stroke`}
            {...(props as any)}
        >
            {children}
            {ripples.map((ripple) => (
                <motion.span
                    key={ripple.id}
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 30, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute bg-white/30 rounded-full w-2 h-2 pointer-events-none"
                    style={{ left: ripple.x, top: ripple.y, transform: "translate(-50%, -50%)" }}
                />
            ))}
        </motion.button>
    );
}
