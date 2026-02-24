"use client";

import { motion } from "framer-motion";

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    as?: React.ElementType;
}

const charVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, damping: 12, stiffness: 200 },
    },
};

export function TextReveal({ text, className = "", delay = 0, as: Component = "span" }: TextRevealProps) {
    const MotionComponent = motion(Component as any);
    const letters = text.split("");

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: delay,
            },
        },
    };

    return (
        <MotionComponent
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className={`flex flex-wrap ${className}`}
        >
            {text.split(" ").map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block mr-[0.25em] whitespace-nowrap">
                    {word.split("").map((char, charIndex) => (
                        <motion.span
                            key={charIndex}
                            variants={charVariants}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </MotionComponent>
    );
}
