'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function TestimonialsSection({ testimonials }: any) {
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
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    }

    const activeTestimonials = (testimonials || []).filter((t: any) => t.isActive !== false)
    const originalTestimonials = activeTestimonials.filter((t: any) => t.isOriginal)
    // Real customer testimonials take priority; dummy ones only fill in when there are no real ones yet.
    const sortedTestimonials = (originalTestimonials.length > 0 ? originalTestimonials : activeTestimonials)
        .slice()
        .sort((a: any, b: any) => a.order - b.order)

    if (!sortedTestimonials.length) return null

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-pearl to-white">
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
                        Loved by Our Customers
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-blush-500 to-rose-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who trust Brella Beauty
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {sortedTestimonials.map((testimonial: any) => (
                        <motion.div
                            key={testimonial.id}
                            variants={cardVariants}
                            whileHover={{ y: -8 }}
                            className="group"
                        >
                            <motion.div
                                className="bg-white rounded-xl p-8 shadow-beauty hover:shadow-beauty-lg transition-all duration-300 border border-mauve-100 h-full flex flex-col"
                                whileHover={{
                                    boxShadow: '0 20px 40px rgba(236, 101, 155, 0.15)',
                                }}
                            >
                                {/* Rating Stars */}
                                <div className="flex gap-1 mb-6">
                                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1, duration: 0.3 }}
                                        >
                                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-gray-700 text-lg leading-relaxed mb-8 flex-1 italic">
                                    "{testimonial.text}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4 pt-6 border-t border-mauve-100">
                                    <motion.img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-blush-200"
                                        whileHover={{ scale: 1.1 }}
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
