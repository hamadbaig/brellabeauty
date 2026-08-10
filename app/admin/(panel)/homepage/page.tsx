'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AdminHeader from '@/components/admin/AdminHeader'
import { ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'

export default function HomepageEditor() {
    const [content, setContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('hero')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/homepage')
            const data = await res.json()
            setContent(data)
            setLoading(false)
        } catch (err) {
            setError('Failed to load content')
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/homepage', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content),
            })
            if (res.ok) {
                setSuccess('Content saved successfully!')
                setTimeout(() => setSuccess(''), 3000)
            }
        } catch (err) {
            setError('Failed to save content')
        } finally {
            setSaving(false)
        }
    }

    const handleHeroChange = (field: string, value: any) => {
        setContent({
            ...content,
            hero: {
                ...content.hero,
                [field]: value,
            },
        })
    }

    const handleCTAChange = (field: string, value: any) => {
        setContent({
            ...content,
            cta: {
                ...content.cta,
                [field]: value,
            },
        })
    }

    const handleCollectionChange = (index: number, field: string, value: any) => {
        const updated = [...content.featuredCollections]
        updated[index] = { ...updated[index], [field]: value }
        setContent({ ...content, featuredCollections: updated })
    }

    const handleFeatureChange = (index: number, field: string, value: any) => {
        const updated = [...content.features]
        updated[index] = { ...updated[index], [field]: value }
        setContent({ ...content, features: updated })
    }

    const handleTestimonialChange = (index: number, field: string, value: any) => {
        const updated = [...content.testimonials]
        updated[index] = { ...updated[index], [field]: value }
        setContent({ ...content, testimonials: updated })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blush-500" />
            </div>
        )
    }

    return (
        <>
            <AdminHeader title="Homepage Editor" />
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Back Button */}
                <Link href="/admin" className="flex items-center gap-2 text-blush hover:text-blush-600 mb-4">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                {/* Alerts */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between"
                    >
                        {error}
                        <button onClick={() => setError('')}>
                            <X size={18} />
                        </button>
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between"
                    >
                        {success}
                        <button onClick={() => setSuccess('')}>
                            <X size={18} />
                        </button>
                    </motion.div>
                )}

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blush-500 to-rose-400 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-white rounded-lg p-2 border border-mauve-100">
                    {['hero', 'collections', 'features', 'testimonials', 'cta'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg capitalize font-medium transition-all ${activeTab === tab
                                    ? 'bg-blush-500 text-white'
                                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Editors */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Hero Section */}
                    {activeTab === 'hero' && content.hero && (
                        <div className="bg-white rounded-xl border border-mauve-100 p-8 shadow-beauty">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">Hero Section</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                                    <input
                                        type="text"
                                        value={content.hero.badge || ''}
                                        onChange={(e) => handleHeroChange('badge', e.target.value)}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                                    <input
                                        type="text"
                                        value={content.hero.heading || ''}
                                        onChange={(e) => handleHeroChange('heading', e.target.value)}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                                    <textarea
                                        value={content.hero.subheading || ''}
                                        onChange={(e) => handleHeroChange('subheading', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CTA Text</label>
                                    <input
                                        type="text"
                                        value={content.hero.ctaText || ''}
                                        onChange={(e) => handleHeroChange('ctaText', e.target.value)}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
                                    <input
                                        type="text"
                                        value={content.hero.backgroundImage || ''}
                                        onChange={(e) => handleHeroChange('backgroundImage', e.target.value)}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Featured Collections */}
                    {activeTab === 'collections' && (
                        <div className="space-y-6">
                            {content.featuredCollections?.map((collection: any, idx: number) => (
                                <div key={collection.id} className="bg-white rounded-xl border border-mauve-100 p-8 shadow-beauty">
                                    <h3 className="text-xl font-bold mb-4 text-gray-900">{collection.title}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={collection.title || ''}
                                                onChange={(e) => handleCollectionChange(idx, 'title', e.target.value)}
                                                className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                            <textarea
                                                value={collection.description || ''}
                                                onChange={(e) => handleCollectionChange(idx, 'description', e.target.value)}
                                                rows={2}
                                                className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                            <input
                                                type="text"
                                                value={collection.image || ''}
                                                onChange={(e) => handleCollectionChange(idx, 'image', e.target.value)}
                                                className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                                                <input
                                                    type="color"
                                                    value={collection.bgColor || '#f5e6d3'}
                                                    onChange={(e) => handleCollectionChange(idx, 'bgColor', e.target.value)}
                                                    className="w-full h-10 border border-mauve-200 rounded-lg cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                                                <input
                                                    type="number"
                                                    value={collection.order || 0}
                                                    onChange={(e) => handleCollectionChange(idx, 'order', parseInt(e.target.value))}
                                                    className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Features */}
                    {activeTab === 'features' && (
                        <div className="space-y-6">
                            {content.features?.map((feature: any, idx: number) => (
                                <div key={feature.id} className="bg-white rounded-xl border border-mauve-100 p-8 shadow-beauty">
                                    <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={feature.title || ''}
                                                onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                                                className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                            <textarea
                                                value={feature.description || ''}
                                                onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                                                rows={2}
                                                className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                                <select
                                                    value={feature.icon || 'Sparkles'}
                                                    onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                                                    className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                                >
                                                    <option>Sparkles</option>
                                                    <option>Heart</option>
                                                    <option>Leaf</option>
                                                    <option>Truck</option>
                                                    <option>Award</option>
                                                    <option>Shield</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                                                <input
                                                    type="number"
                                                    value={feature.order || 0}
                                                    onChange={(e) => handleFeatureChange(idx, 'order', parseInt(e.target.value))}
                                                    className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Testimonials */}
                    {activeTab === 'testimonials' && (
                        <div className="space-y-6">
                            {content.testimonials?.map((testimonial: any, idx: number) => (
                                <div key={testimonial.id} className="bg-white rounded-xl border border-mauve-100 p-8 shadow-beauty">
                                    <h3 className="text-xl font-bold mb-4 text-gray-900">{testimonial.name}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                            <input
                                                type="text"
                                                value={testimonial.name || ''}
                                                onChange={(e) => handleTestimonialChange(idx, 'name', e.target.value)}
                                                className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                            <input
                                                type="text"
                                                value={testimonial.role || ''}
                                                onChange={(e) => handleTestimonialChange(idx, 'role', e.target.value)}
                                                className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial</label>
                                            <textarea
                                                value={testimonial.text || ''}
                                                onChange={(e) => handleTestimonialChange(idx, 'text', e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                                <input
                                                    type="text"
                                                    value={testimonial.image || ''}
                                                    onChange={(e) => handleTestimonialChange(idx, 'image', e.target.value)}
                                                    className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={testimonial.rating || 5}
                                                    onChange={(e) => handleTestimonialChange(idx, 'rating', parseInt(e.target.value))}
                                                    className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTA Section */}
                    {activeTab === 'cta' && content.cta && (
                        <div className="bg-white rounded-xl border border-mauve-100 p-8 shadow-beauty">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">CTA Section</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                                    <input
                                        type="text"
                                        value={content.cta.heading || ''}
                                        onChange={(e) => handleCTAChange('heading', e.target.value)}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                                    <textarea
                                        value={content.cta.subheading || ''}
                                        onChange={(e) => handleCTAChange('subheading', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary CTA Text</label>
                                        <input
                                            type="text"
                                            value={content.cta.ctaText || ''}
                                            onChange={(e) => handleCTAChange('ctaText', e.target.value)}
                                            className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary CTA Text</label>
                                        <input
                                            type="text"
                                            value={content.cta.secondaryCtaText || ''}
                                            onChange={(e) => handleCTAChange('secondaryCtaText', e.target.value)}
                                            className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
                                    <input
                                        type="text"
                                        value={content.cta.backgroundImage || ''}
                                        onChange={(e) => handleCTAChange('backgroundImage', e.target.value)}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>
        </>
    )
}
