'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'

export default function CTASection({ settings }: any) {
    const backgroundImage = settings?.backgroundImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80'

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    }

    return (
        <section
            className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
            style={{
                backgroundImage: `url('${backgroundImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70" />

            {/* Animated background shapes */}
            <motion.div
                className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
                style={{ background: 'linear-gradient(135deg, #fce7f3, #e9d5ff)' }}
                animate={{
                    y: [0, 40, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
                style={{ background: 'linear-gradient(135deg, #fef3c7, #fce7f3)' }}
                animate={{
                    y: [0, -40, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {/* Main Heading */}
                    <motion.h2
                        variants={itemVariants}
                        className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                    >
                        {settings?.heading || 'Ready to Elevate Your Beauty Routine?'}
                    </motion.h2>

                    {/* Subheading */}
                    <motion.p
                        variants={itemVariants}
                        className="text-xl sm:text-2xl text-white/90 mb-10 max-w-2xl mx-auto"
                    >
                        {settings?.subheading || 'Join thousands of satisfied customers enjoying premium beauty products'}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/shop">
                            <motion.button
                                className="px-8 py-4 bg-gradient-to-r from-blush-500 to-rose-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {settings?.ctaText || 'Shop Now'}
                                <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                        <Link href="#contact">
                            <motion.button
                                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {settings?.secondaryCtaText || 'Contact Us'}
                                <Heart size={20} />
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12"
                    >
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">10K+</p>
                            <p className="text-white/70 text-sm">Happy Customers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">500+</p>
                            <p className="text-white/70 text-sm">5-Star Reviews</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">100%</p>
                            <p className="text-white/70 text-sm">Cruelty Free</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
