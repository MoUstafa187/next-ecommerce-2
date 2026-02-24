"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface RollingNumberProps {
    value: number;
    className?: string;
}

export function RollingNumber({ value, className = "" }: RollingNumberProps) {
    const animatedValue = useSpring(value, {
        stiffness: 100,
        damping: 20,
    });

    useEffect(() => {
        animatedValue.set(value);
    }, [animatedValue, value]);

    // Format the number dynamically
    const displayValue = useTransform(animatedValue, (current) => {
        return Math.floor(current);
    });

    return (
        <motion.span className={`inline-block tabular-nums ${className}`}>
            {displayValue}
        </motion.span>
    );
}
