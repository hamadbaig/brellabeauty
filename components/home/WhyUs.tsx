'use client'

import { motion } from 'framer-motion'
import { Sparkles, Heart, Leaf, Truck, Award, Shield, Users, Star } from 'lucide-react'

const iconMap: any = {
    Sparkles,
    Heart,
    Leaf,
    Truck,
    Award,
    Shield,
    Users,
    Star,
}

export default function WhyUs({ settings }: any) {
    if (settings?.isActive === false) return null

    const stats = (settings?.stats || []).slice().sort((a: any, b: any) => a.order - b.order)
    if (!stats.length) return null

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-mauve-900 via-gray-900 to-mauve-900 relative overflow-hidden">
            {/* Animated background shapes */}
            <motion.div
                className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
                style={{ background: 'linear-gradient(135deg, #ec659b, #e9d5ff)' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
                        {settings?.heading || 'The Brella Beauty Difference'}
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-blush-500 to-rose-400 mx-auto mb-4" />
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        {settings?.subheading || 'Numbers that reflect our commitment to you'}
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {stats.map((stat: any) => {
                        const Icon = iconMap[stat.icon] || Sparkles
                        return (
                            <motion.div
                                key={stat.id}
                                variants={itemVariants}
                                whileHover={{ y: -6 }}
                                className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                            >
                                <motion.div
                                    className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blush-500 to-rose-400 text-white flex items-center justify-center mb-4"
                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                >
                                    <Icon size={22} />
                                </motion.div>
                                <p className="font-serif text-3xl sm:text-4xl font-bold text-white mb-1">
                                    {stat.value}
                                </p>
                                <p className="text-white/60 text-sm">{stat.label}</p>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}
