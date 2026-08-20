'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function BrandStory({ settings }: any) {
    if (settings?.isActive === false) return null

    const image = settings?.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80'

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <motion.div
                    className="relative h-80 sm:h-[28rem] rounded-2xl overflow-hidden shadow-beauty-lg"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    viewport={{ once: true }}
                >
                    <motion.img
                        src={image}
                        alt={settings?.heading || 'Our Story'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        initial={{ scale: 1.15 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        viewport={{ once: true }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </motion.div>

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blush-50 text-blush-600 text-sm font-medium tracking-beauty uppercase mb-6">
                        <Sparkles size={14} />
                        {settings?.badge || 'Our Story'}
                    </span>
                    <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {settings?.heading || 'Crafted With Passion & Purpose'}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                        {settings?.body ||
                            'Every Brella Beauty product begins with a simple belief: beauty should be elegant, ethical, and effortless.'}
                    </p>
                    <Link href={settings?.ctaLink || '/shop'}>
                        <motion.button
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blush-500 to-rose-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {settings?.ctaText || 'Discover Our Journey'}
                            <ArrowRight size={18} />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
