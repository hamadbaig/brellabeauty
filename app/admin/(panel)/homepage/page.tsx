'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import AdminHeader from '@/components/admin/AdminHeader'
import ImageUploadButton from '@/components/admin/ImageUploadButton'
import { ArrowLeft, Save, X, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, AlertTriangle } from 'lucide-react'

const SECTION_LABELS: Record<string, string> = {
    hero: 'Hero',
    marquee: 'Marquee Ticker',
    collections: 'Featured Collections',
    brandStory: 'Brand Story',
    features: 'Why Choose Us (Features)',
    whyUs: 'Stats / Brella Difference',
    testimonials: 'Testimonials',
    cta: 'Call To Action',
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            {value && (
                <div className="relative inline-block mb-3">
                    <img src={value} alt="" className="h-32 max-w-xs object-cover rounded-lg border border-mauve-200" />
                    <button
                        type="button"
                        title="Remove image"
                        onClick={() => onChange('')}
                        className="absolute -top-2 -right-2 bg-white rounded-full shadow text-red-400 hover:text-red-600 p-1"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
            <div>
                <ImageUploadButton
                    label={value ? 'Replace Image' : 'Choose Image'}
                    onUploaded={(urls) => onChange(urls[0])}
                />
            </div>
        </div>
    )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-blush-500' : 'bg-gray-300'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
            {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
        </label>
    )
}

function ItemCardHeader({ title, onDelete }: { title: string; onDelete: () => void }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
                type="button"
                onClick={onDelete}
                title="Delete"
                className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
            >
                <Trash2 size={16} />
                Delete
            </button>
        </div>
    )
}

export default function HomepageEditor() {
    const router = useRouter()
    const [content, setContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('sections')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    // Snapshot of the last saved/loaded content, used to detect unsaved changes.
    const savedSnapshotRef = useRef('')
    // Action to run (switch tab / navigate away) once the unsaved-changes prompt is resolved.
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

    const isDirty = !!content && JSON.stringify(content) !== savedSnapshotRef.current

    useEffect(() => {
        if (!isDirty) return
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [isDirty])

    const guardNavigation = (action: () => void) => {
        if (isDirty) {
            setPendingAction(() => action)
        } else {
            action()
        }
    }

    const discardChanges = () => {
        if (savedSnapshotRef.current) setContent(JSON.parse(savedSnapshotRef.current))
    }

    useEffect(() => {
        fetchContent()
    }, [])

    // Defends the editor against any section coming back missing/null so a tab never goes blank.
    const normalizeContent = (data: any) => ({
        ...data,
        hero: data.hero || {},
        cta: data.cta || {},
        brandStory: data.brandStory || {},
        whyUs: { ...(data.whyUs || {}), stats: data.whyUs?.stats || [] },
        featuredCollections: data.featuredCollections || [],
        features: data.features || [],
        testimonials: data.testimonials || [],
        sections: data.sections || [],
    })

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/homepage', { cache: 'no-store' })
            const raw = await res.json()
            const data = normalizeContent(raw)
            setContent(data)
            savedSnapshotRef.current = JSON.stringify(data)
            setLoading(false)
        } catch (err) {
            setError('Failed to load content')
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setError('')
        try {
            const res = await fetch('/api/homepage', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content),
            })
            const data = await res.json().catch(() => null)
            if (res.ok) {
                const saved = normalizeContent(data ?? content)
                setContent(saved)
                savedSnapshotRef.current = JSON.stringify(saved)
                setSuccess('Content saved successfully!')
                setTimeout(() => setSuccess(''), 3000)
                return true
            } else {
                setError(data?.error || `Failed to save content (${res.status})`)
                return false
            }
        } catch (err) {
            setError('Failed to save content')
            return false
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

    const addCollection = () => {
        const item = {
            id: `collection-${Date.now()}`,
            title: 'New Collection',
            description: '',
            image: '',
            link: '/shop',
            bgColor: '#f5e6d3',
            textColor: '#1a1a1a',
            isActive: true,
            order: (content.featuredCollections?.length || 0) + 1,
        }
        setContent({ ...content, featuredCollections: [...(content.featuredCollections || []), item] })
    }

    const removeCollection = (index: number) => {
        setContent({ ...content, featuredCollections: content.featuredCollections.filter((_: any, i: number) => i !== index) })
    }

    const handleFeatureChange = (index: number, field: string, value: any) => {
        const updated = [...content.features]
        updated[index] = { ...updated[index], [field]: value }
        setContent({ ...content, features: updated })
    }

    const addFeature = () => {
        const item = {
            id: `feature-${Date.now()}`,
            title: 'New Feature',
            description: '',
            icon: 'Sparkles',
            isActive: true,
            order: (content.features?.length || 0) + 1,
        }
        setContent({ ...content, features: [...(content.features || []), item] })
    }

    const removeFeature = (index: number) => {
        setContent({ ...content, features: content.features.filter((_: any, i: number) => i !== index) })
    }

    const handleTestimonialChange = (index: number, field: string, value: any) => {
        const updated = [...content.testimonials]
        updated[index] = { ...updated[index], [field]: value }
        setContent({ ...content, testimonials: updated })
    }

    const addTestimonial = () => {
        const item = {
            id: `testimonial-${Date.now()}`,
            name: '',
            role: 'Customer',
            text: '',
            image: '',
            rating: 5,
            isOriginal: true,
            isActive: true,
            order: (content.testimonials?.length || 0) + 1,
        }
        setContent({ ...content, testimonials: [...(content.testimonials || []), item] })
    }

    const removeTestimonial = (index: number) => {
        setContent({ ...content, testimonials: content.testimonials.filter((_: any, i: number) => i !== index) })
    }

    const handleBrandStoryChange = (field: string, value: any) => {
        setContent({ ...content, brandStory: { ...content.brandStory, [field]: value } })
    }

    const handleWhyUsChange = (field: string, value: any) => {
        setContent({ ...content, whyUs: { ...content.whyUs, [field]: value } })
    }

    const handleWhyUsStatChange = (index: number, field: string, value: any) => {
        const updated = [...content.whyUs.stats]
        updated[index] = { ...updated[index], [field]: value }
        setContent({ ...content, whyUs: { ...content.whyUs, stats: updated } })
    }

    const addWhyUsStat = () => {
        const item = {
            id: `stat-${Date.now()}`,
            label: 'New Stat',
            value: '0',
            icon: 'Sparkles',
            order: (content.whyUs?.stats?.length || 0) + 1,
        }
        setContent({ ...content, whyUs: { ...content.whyUs, stats: [...(content.whyUs?.stats || []), item] } })
    }

    const removeWhyUsStat = (index: number) => {
        setContent({ ...content, whyUs: { ...content.whyUs, stats: content.whyUs.stats.filter((_: any, i: number) => i !== index) } })
    }

    const toggleSectionActive = (key: string) => {
        const updated = content.sections.map((s: any) => (s.key === key ? { ...s, isActive: !s.isActive } : s))
        setContent({ ...content, sections: updated })
    }

    const moveSection = (key: string, direction: 'up' | 'down') => {
        const sections = [...content.sections].sort((a: any, b: any) => a.order - b.order)
        const idx = sections.findIndex((s: any) => s.key === key)
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1
        if (swapIdx < 0 || swapIdx >= sections.length) return
        const tmp = sections[idx].order
        sections[idx].order = sections[swapIdx].order
        sections[swapIdx].order = tmp
        setContent({ ...content, sections })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blush-500" />
            </div>
        )
    }

    const sortedSections = (content.sections || []).slice().sort((a: any, b: any) => a.order - b.order)

    return (
        <>
            <AdminHeader title="Homepage Editor" />
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => guardNavigation(() => router.push('/admin'))}
                    className="flex items-center gap-2 text-blush hover:text-blush-600 mb-4"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>

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
                <div className={`sticky top-0 z-20 -mx-6 -mt-2 mb-2 px-6 py-3 flex items-center justify-between backdrop-blur bg-white/90 border-b transition-colors ${isDirty ? 'border-blush-300' : 'border-transparent'
                    }`}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        {isDirty ? (
                            <>
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blush-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blush-500" />
                                </span>
                                <span className="text-blush-600">You have unsaved changes</span>
                            </>
                        ) : (
                            <span className="text-gray-400">All changes saved</span>
                        )}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving || !isDirty}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blush-500 to-rose-400 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-white rounded-lg p-2 border border-mauve-100 flex-wrap">
                    {['sections', 'hero', 'collections', 'brandStory', 'features', 'whyUs', 'testimonials', 'cta'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => guardNavigation(() => setActiveTab(tab))}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab
                                ? 'bg-blush-500 text-white'
                                : 'bg-transparent text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {SECTION_LABELS[tab] || 'Sections'}
                        </button>
                    ))}
                </div>

                {/* Unsaved changes prompt */}
                <AnimatePresence>
                    {pendingAction && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
                            onClick={() => setPendingAction(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Unsaved changes</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-6">
                                    You've made changes that haven't been saved yet. Do you want to save them before continuing?
                                </p>
                                <div className="flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const action = pendingAction
                                            const ok = await handleSave()
                                            if (ok) { setPendingAction(null); action?.() }
                                        }}
                                        disabled={saving}
                                        className="px-4 py-2.5 bg-gradient-to-r from-blush-500 to-rose-400 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save & Continue'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const action = pendingAction
                                            discardChanges()
                                            setPendingAction(null)
                                            action?.()
                                        }}
                                        className="px-4 py-2.5 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                                    >
                                        Discard Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPendingAction(null)}
                                        className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content Editors */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Sections order/visibility */}
                    {activeTab === 'sections' && (
                        <div className="bg-white rounded-xl border border-mauve-100 p-8 shadow-beauty">
                            <h2 className="text-2xl font-bold mb-2 text-gray-900">Homepage Sections</h2>
                            <p className="text-gray-600 mb-6 text-sm">
                                Control which sections appear on the homepage, and in what order. Toggle a section off to hide it completely.
                            </p>
                            <div className="space-y-3">
                                {sortedSections.map((section: any, idx: number) => (
                                    <div
                                        key={section.key}
                                        className={`flex items-center justify-between gap-4 p-4 rounded-lg border ${section.isActive !== false ? 'border-mauve-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-70'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {section.isActive !== false ? (
                                                <Eye size={18} className="text-blush-500" />
                                            ) : (
                                                <EyeOff size={18} className="text-gray-400" />
                                            )}
                                            <span className="font-medium text-gray-900">
                                                {SECTION_LABELS[section.key] || section.key}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => moveSection(section.key, 'up')}
                                                disabled={idx === 0}
                                                className="p-1.5 rounded-md border border-mauve-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                                                title="Move up"
                                            >
                                                <ArrowUp size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveSection(section.key, 'down')}
                                                disabled={idx === sortedSections.length - 1}
                                                className="p-1.5 rounded-md border border-mauve-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                                                title="Move down"
                                            >
                                                <ArrowDown size={14} />
                                            </button>
                                            <Toggle
                                                label=""
                                                checked={section.isActive !== false}
                                                onChange={() => toggleSectionActive(section.key)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hero Section */}
                    {activeTab === 'hero' && (
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
                                <ImageField
                                    label="Background Image"
                                    value={content.hero.backgroundImage || ''}
                                    onChange={(url) => handleHeroChange('backgroundImage', url)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Featured Collections */}
                    {activeTab === 'collections' && (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <button
                                    onClick={addCollection}
                                    className="flex items-center gap-2 px-4 py-2 bg-blush-500 text-white rounded-lg hover:bg-blush-600 transition-colors"
                                >
                                    <Plus size={16} />
                                    Add Collection
                                </button>
                            </div>
                            <AnimatePresence>
                                {content.featuredCollections?.map((collection: any, idx: number) => (
                                    <motion.div
                                        key={collection.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-white rounded-xl border border-mauve-100 p-8 shadow-beauty"
                                    >
                                        <ItemCardHeader title={collection.title || 'Untitled'} onDelete={() => removeCollection(idx)} />
                                        <div className="space-y-4">
                                            <Toggle
                                                label="Visible on homepage"
                                                checked={collection.isActive !== false}
                                                onChange={(v) => handleCollectionChange(idx, 'isActive', v)}
                                            />
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
                                            <ImageField
                                                label="Image"
                                                value={collection.image || ''}
                                                onChange={(url) => handleCollectionChange(idx, 'image', url)}
                                            />
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
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Brand Story */}
                    {activeTab === 'brandStory' && (
                        <div className="bg-white rounded-xl border border-mauve-100 p-8 shadow-beauty">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Brand Story</h2>
                                <Toggle
                                    label="Visible"
                                    checked={content.brandStory.isActive !== false}
                                    onChange={(v) => handleBrandStoryChange('isActive', v)}
                                />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                                    <input
                                        type="text"
                                        value={content.brandStory.badge || ''}
                                        onChange={(e) => handleBrandStoryChange('badge', e.target.value)}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                                    <input
                                        type="text"
                                        value={content.brandStory.heading || ''}
                                        onChange={(e) => handleBrandStoryChange('heading', e.target.value)}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
                                    <textarea
                                        value={content.brandStory.body || ''}
                                        onChange={(e) => handleBrandStoryChange('body', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                    />
                                </div>
                                <ImageField
                                    label="Image"
                                    value={content.brandStory.image || ''}
                                    onChange={(url) => handleBrandStoryChange('image', url)}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CTA Text</label>
                                        <input
                                            type="text"
                                            value={content.brandStory.ctaText || ''}
                                            onChange={(e) => handleBrandStoryChange('ctaText', e.target.value)}
                                            className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CTA Link</label>
                                        <input
                                            type="text"
                                            value={content.brandStory.ctaLink || ''}
                                            onChange={(e) => handleBrandStoryChange('ctaLink', e.target.value)}
                                            className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Features */}
                    {activeTab === 'features' && (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <button
                                    onClick={addFeature}
                                    className="flex items-center gap-2 px-4 py-2 bg-blush-500 text-white rounded-lg hover:bg-blush-600 transition-colors"
                                >
                                    <Plus size={16} />
                                    Add Feature
                                </button>
                            </div>
                            <AnimatePresence>
                                {content.features?.map((feature: any, idx: number) => (
                                    <motion.div
                                        key={feature.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-white rounded-xl border border-mauve-100 p-8 shadow-beauty"
                                    >
                                        <ItemCardHeader title={feature.title || 'Untitled'} onDelete={() => removeFeature(idx)} />
                                        <div className="space-y-4">
                                            <Toggle
                                                label="Visible on homepage"
                                                checked={feature.isActive !== false}
                                                onChange={(v) => handleFeatureChange(idx, 'isActive', v)}
                                            />
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
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Why Us / Stats */}
                    {activeTab === 'whyUs' && (
                        <div className="bg-white rounded-xl border border-mauve-100 p-8 shadow-beauty">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Stats Section</h2>
                                <Toggle
                                    label="Visible"
                                    checked={content.whyUs.isActive !== false}
                                    onChange={(v) => handleWhyUsChange('isActive', v)}
                                />
                            </div>
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                                    <input
                                        type="text"
                                        value={content.whyUs.heading || ''}
                                        onChange={(e) => handleWhyUsChange('heading', e.target.value)}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                                    <input
                                        type="text"
                                        value={content.whyUs.subheading || ''}
                                        onChange={(e) => handleWhyUsChange('subheading', e.target.value)}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Stats</h3>
                                <button
                                    onClick={addWhyUsStat}
                                    className="flex items-center gap-2 px-4 py-2 bg-blush-500 text-white rounded-lg hover:bg-blush-600 transition-colors text-sm"
                                >
                                    <Plus size={16} />
                                    Add Stat
                                </button>
                            </div>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {content.whyUs.stats?.map((stat: any, idx: number) => (
                                        <motion.div
                                            key={stat.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-4 border border-mauve-100 rounded-lg"
                                        >
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                                                <input
                                                    type="text"
                                                    value={stat.value || ''}
                                                    onChange={(e) => handleWhyUsStatChange(idx, 'value', e.target.value)}
                                                    className="w-full px-3 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                                                <input
                                                    type="text"
                                                    value={stat.label || ''}
                                                    onChange={(e) => handleWhyUsStatChange(idx, 'label', e.target.value)}
                                                    className="w-full px-3 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Icon</label>
                                                <select
                                                    value={stat.icon || 'Sparkles'}
                                                    onChange={(e) => handleWhyUsStatChange(idx, 'icon', e.target.value)}
                                                    className="w-full px-3 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                                >
                                                    <option>Sparkles</option>
                                                    <option>Heart</option>
                                                    <option>Leaf</option>
                                                    <option>Truck</option>
                                                    <option>Award</option>
                                                    <option>Shield</option>
                                                    <option>Users</option>
                                                    <option>Star</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Order</label>
                                                <input
                                                    type="number"
                                                    value={stat.order || 0}
                                                    onChange={(e) => handleWhyUsStatChange(idx, 'order', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush-500"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeWhyUsStat(idx)}
                                                className="flex items-center justify-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium h-10"
                                            >
                                                <Trash2 size={16} />
                                                Remove
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {/* Testimonials */}
                    {activeTab === 'testimonials' && (
                        <div className="space-y-6">
                            <div className="bg-blush-50 border border-blush-100 text-gray-700 text-sm rounded-lg px-4 py-3">
                                Mark a testimonial as <strong>Real / Original</strong> once it comes from an actual customer.
                                When at least one real, visible testimonial exists, only real testimonials are shown on the
                                storefront — placeholder testimonials are used only as a fallback when there are none yet.
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={addTestimonial}
                                    className="flex items-center gap-2 px-4 py-2 bg-blush-500 text-white rounded-lg hover:bg-blush-600 transition-colors"
                                >
                                    <Plus size={16} />
                                    Add Testimonial
                                </button>
                            </div>
                            <AnimatePresence>
                                {content.testimonials?.map((testimonial: any, idx: number) => (
                                    <motion.div
                                        key={testimonial.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-white rounded-xl border border-mauve-100 p-8 shadow-beauty"
                                    >
                                        <ItemCardHeader title={testimonial.name || 'Untitled'} onDelete={() => removeTestimonial(idx)} />
                                        <div className="flex flex-wrap gap-6 mb-4">
                                            <Toggle
                                                label="Visible on homepage"
                                                checked={testimonial.isActive !== false}
                                                onChange={(v) => handleTestimonialChange(idx, 'isActive', v)}
                                            />
                                            <Toggle
                                                label="Real / Original testimonial"
                                                checked={!!testimonial.isOriginal}
                                                onChange={(v) => handleTestimonialChange(idx, 'isOriginal', v)}
                                            />
                                        </div>
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
                                                <ImageField
                                                    label="Image"
                                                    value={testimonial.image || ''}
                                                    onChange={(url) => handleTestimonialChange(idx, 'image', url)}
                                                />
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
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* CTA Section */}
                    {activeTab === 'cta' && (
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
                                <ImageField
                                    label="Background Image"
                                    value={content.cta.backgroundImage || ''}
                                    onChange={(url) => handleCTAChange('backgroundImage', url)}
                                />
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>
        </>
    )
}
