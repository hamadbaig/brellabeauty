'use client'

import { motion } from 'framer-motion'
import { Sparkles, Heart, Leaf, Truck, Award, Shield } from 'lucide-react'

const iconMap: any = {
    Sparkles,
    Heart,
    Leaf,
    Truck,
    Award,
    Shield,
}

export default function FeaturesSection({ features }: any) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    }

    const featureVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    }

    const sortedFeatures = (features || []).sort((a: any, b: any) => a.order - b.order)

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
                        Why Choose Brella Beauty?
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-blush-500 to-rose-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Premium quality, ethical practices, and exceptional results
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {sortedFeatures.map((feature: any) => {
                        const Icon = iconMap[feature.icon] || Sparkles

                        return (
                            <motion.div
                                key={feature.id}
                                variants={featureVariants}
                                whileHover={{ y: -8 }}
                                className="group"
                            >
                                <motion.div
                                    className="bg-gradient-to-br from-blush-50 to-pearl rounded-xl p-8 h-full shadow-beauty hover:shadow-beauty-lg transition-shadow duration-300"
                                    whileHover={{
                                        boxShadow: '0 20px 40px rgba(236, 101, 155, 0.1)',
                                    }}
                                >
                                    {/* Icon */}
                                    <motion.div
                                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-blush-500 to-rose-400 text-white flex items-center justify-center mb-6 group-hover:shadow-lg"
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Icon size={28} />
                                    </motion.div>

                                    {/* Title */}
                                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Decorative line */}
                                    <motion.div
                                        className="mt-6 h-1 bg-gradient-to-r from-blush-500 to-rose-400 w-0 group-hover:w-full transition-all duration-300"
                                    />
                                </motion.div>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}
