"use client";

import { motion } from "framer-motion";

const variants = {
    hidden: { opacity: 0, scale: 0.96, y: 15 },
    enter: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number] // Custom cubic-bezier for filmic edit
        }
    },
};

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="enter"
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
}
