'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function FeaturedCollections({ collections }: any) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
        hover: {
            y: -10,
            transition: { duration: 0.3 },
        },
    }

    const imageVariants = {
        hover: {
            scale: 1.1,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    }

    const sortedCollections = (collections || []).sort((a: any, b: any) => a.order - b.order)

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-pearl">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Featured Collections
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-blush-500 to-rose-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our curated beauty collections designed for every mood and occasion
                    </p>
                </motion.div>

                {/* Collections Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {sortedCollections.map((collection: any) => (
                        <motion.div
                            key={collection.id}
                            variants={cardVariants}
                            whileHover="hover"
                            className="group"
                        >
                            <Link href={collection.link || '/shop'}>
                                <motion.div
                                    className="relative h-80 rounded-xl overflow-hidden shadow-beauty-lg cursor-pointer"
                                    style={{ backgroundColor: collection.bgColor || '#f5e6d3' }}
                                >
                                    {/* Background Image */}
                                    <motion.div
                                        className="absolute inset-0 overflow-hidden"
                                        variants={imageVariants}
                                    >
                                        <img
                                            src={collection.image}
                                            alt={collection.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300" />
                                    </motion.div>

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                        <motion.h3
                                            className="font-serif text-2xl sm:text-3xl font-bold mb-2"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {collection.title}
                                        </motion.h3>
                                        <motion.p
                                            className="text-white/90 mb-4 text-sm"
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.1 }}
                                        >
                                            {collection.description}
                                        </motion.p>
                                        <motion.div
                                            className="flex items-center gap-2 text-white font-semibold"
                                            whileHover={{ gap: 8 }}
                                        >
                                            Shop Collection
                                            <ArrowRight size={18} />
                                        </motion.div>
                                    </div>

                                    {/* Decorative accent */}
                                    <motion.div
                                        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    />
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
