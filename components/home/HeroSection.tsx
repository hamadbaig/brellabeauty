'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroSection({ settings }: any) {
    const backgroundImage = settings?.backgroundImage || 'https://images.unsplash.com/photo-1596462502278-af407713ca9f?w=1920&q=80'

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    }

    return (
        <section
            className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
            style={{
                backgroundImage: `url('${backgroundImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Animated background shapes */}
            <motion.div
                className="absolute top-10 right-20 w-72 h-72 rounded-full opacity-20 blur-3xl"
                style={{ background: 'linear-gradient(135deg, #fce7f3, #e9d5ff)' }}
                animate={{
                    y: [0, 50, 0],
                    x: [0, 30, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute bottom-10 left-20 w-72 h-72 rounded-full opacity-20 blur-3xl"
                style={{ background: 'linear-gradient(135deg, #f3e8ff, #fef3c7)' }}
                animate={{
                    y: [0, -50, 0],
                    x: [0, -30, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Content */}
            <motion.div
                className="relative z-10 text-center text-white max-w-4xl px-4 sm:px-6 lg:px-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Badge */}
                <motion.div
                    variants={itemVariants}
                    className="mb-6 inline-block"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm tracking-beauty uppercase font-medium">
                        ✨ {settings?.badge || 'Luxury Beauty'}
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    variants={itemVariants}
                    className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                >
                    {settings?.heading || 'Brella Beauty'}
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    variants={itemVariants}
                    className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
                >
                    {settings?.subheading || 'Premium Beauty Products Crafted with Elegance'}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-start"
                >
                    <Link href="/shop">
                        <motion.button
                            className="px-8 py-4 bg-gradient-to-r from-blush-500 to-rose-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {settings?.ctaText || 'Shop Collection'}
                        </motion.button>
                    </Link>
                    <div className="flex flex-col items-center gap-2">
                        <Link href="/shop">
                            <motion.button
                                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Explore More
                            </motion.button>
                        </Link>
                        <motion.div
                            className="flex flex-col items-center gap-1"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="text-sm text-white/70">Scroll to explore</span>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
