'use client'

import { motion } from 'framer-motion'

interface MarqueeTickerProps {
    text?: string
    items?: string[]
}

export default function MarqueeTicker({ text, items }: MarqueeTickerProps) {
    const marqueeText = text || 'Premium Quality • Cruelty Free • Vegan Formulas • Handcrafted • Fast Shipping •'
    const repeatedText = Array(3).fill(marqueeText).join(' ')

    return (
        <div className="bg-gradient-to-r from-blush-500 via-rose-400 to-blush-500 text-white py-4 overflow-hidden">
            <motion.div
                className="flex whitespace-nowrap gap-8"
                animate={{ x: ['0%', '-33.33%'] }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                {repeatedText.split('•').map((item, i) => (
                    item.trim() && (
                        <span key={i} className="text-sm sm:text-base font-medium tracking-wider">
                            ✨ {item.trim()}
                        </span>
                    )
                ))}
            </motion.div>
        </div>
    )
}
