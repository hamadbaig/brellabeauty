'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, Truck, ShieldCheck, Leaf, Droplet, ChevronDown, ChevronUp, Star } from 'lucide-react'
import { Product, ProductReview } from '@/types/product'
import { buildProductWhatsAppLink } from '@/lib/whatsapp'

interface Props {
    product: Product
}

const DESCRIPTION_TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'ingredients', label: 'Ingredients' },
    { key: 'howToUse', label: 'How To Use' },
    { key: 'benefits', label: 'Benefits' },
] as const

export default function ProductDetail({ product }: Props) {
    const [shadeIndex, setShadeIndex] = useState(0)
    const [sizeLabel, setSizeLabel] = useState<string | undefined>(
        product.sizes?.find(s => s.available)?.label
    )
    const [imgIndex, setImgIndex] = useState(0)
    const [descTab, setDescTab] = useState<(typeof DESCRIPTION_TABS)[number]['key']>('overview')
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const [reviews, setReviews] = useState<ProductReview[]>(product.reviews || [])
    const [averageRating, setAverageRating] = useState(product.averageRating)
    const [totalReviews, setTotalReviews] = useState(product.totalReviews)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [reviewForm, setReviewForm] = useState({ author: '', location: '', title: '', comment: '', rating: 5 })
    const [reviewSubmitting, setReviewSubmitting] = useState(false)
    const [reviewError, setReviewError] = useState('')
    const [reviewSuccess, setReviewSuccess] = useState(false)

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setReviewError('')
        if (!reviewForm.author.trim() || !reviewForm.comment.trim()) {
            setReviewError('Please add your name and a comment.')
            return
        }
        setReviewSubmitting(true)
        try {
            const res = await fetch(`/api/products/${product.id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewForm),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to submit review')

            setReviews(prev => [data.review, ...prev])
            setAverageRating(data.averageRating)
            setTotalReviews(data.totalReviews)
            setReviewForm({ author: '', location: '', title: '', comment: '', rating: 5 })
            setReviewSuccess(true)
            setShowReviewForm(false)
        } catch (err: any) {
            setReviewError(err.message || 'Something went wrong')
        } finally {
            setReviewSubmitting(false)
        }
    }

    const shade = product.colors[shadeIndex]
    const images = shade?.images?.length ? shade.images : product.colors[0]?.images ?? []

    const selectedSize = product.sizes?.find(s => s.label === sizeLabel)
    const displayPrice = selectedSize?.price ?? product.price
    const displayOriginalPrice = selectedSize?.price !== undefined ? selectedSize.originalPrice : product.originalPrice
    const discountPct = displayOriginalPrice
        ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
        : 0

    const whatsappHref = buildProductWhatsAppLink(product, {
        shade: shade?.name,
        size: sizeLabel,
        price: displayPrice,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
    })

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Gallery */}
            <div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-pearl-dark mb-4 zoom-wrapper">
                    {images[imgIndex] && (
                        <Image
                            src={images[imgIndex]}
                            alt={product.name}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    )}
                    {discountPct > 0 && (
                        <span className="absolute top-4 left-4 bg-blush text-white text-xs font-sans font-bold px-3 py-1 tracking-widest uppercase rounded">
                            {discountPct}% Off
                        </span>
                    )}
                </div>
                {images.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                        {images.map((img, i) => (
                            <button
                                key={img + i}
                                type="button"
                                onClick={() => setImgIndex(i)}
                                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIndex ? 'thumb-active border-blush' : 'border-mauve-100'}`}
                            >
                                <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div>
                <p className="label-blush mb-2">{product.collection}</p>
                <h1 className="font-serif text-3xl sm:text-4xl text-mauve-950 mb-3">{product.name}</h1>

                {averageRating > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-blush text-sm">{'★'.repeat(Math.round(averageRating))}</span>
                        <span className="text-sm text-mauve-500">{averageRating.toFixed(1)} ({totalReviews} reviews)</span>
                    </div>
                )}

                <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-3xl font-bold text-mauve-900">{product.currencySymbol} {displayPrice.toLocaleString('en-PK')}</span>
                    {displayOriginalPrice && (
                        <span className="text-lg text-mauve-400 line-through">{product.currencySymbol} {displayOriginalPrice.toLocaleString('en-PK')}</span>
                    )}
                </div>

                {/* Shades */}
                {product.colors.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-sans font-medium text-mauve-700 mb-2">
                            Shade: <span className="font-semibold text-mauve-950">{shade?.name}</span>
                        </h3>
                        <div className="flex gap-3 flex-wrap">
                            {product.colors.map((c, i) => (
                                <button
                                    key={c.name}
                                    type="button"
                                    title={c.name}
                                    onClick={() => { setShadeIndex(i); setImgIndex(0) }}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${i === shadeIndex ? 'border-blush ring-2 ring-blush ring-offset-2' : 'border-mauve-200'}`}
                                    style={{ backgroundColor: c.hex }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity (ml) */}
                {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-sans font-medium text-mauve-700 mb-2">Quantity</h3>
                        <div className="flex gap-2 flex-wrap">
                            {product.sizes.map(s => (
                                <button
                                    key={s.label}
                                    type="button"
                                    disabled={!s.available}
                                    onClick={() => setSizeLabel(s.label)}
                                    className={`flex flex-col items-center px-4 py-2 text-sm font-sans border transition-colors ${!s.available ? 'border-mauve-100 text-mauve-300 cursor-not-allowed' :
                                        sizeLabel === s.label ? 'border-blush bg-blush text-white' : 'border-mauve-200 text-mauve-700 hover:border-blush'
                                        }`}
                                >
                                    <span className={!s.available ? 'line-through' : ''}>{s.label}</span>
                                    {s.price !== undefined && (
                                        <span className={`text-[10px] ${sizeLabel === s.label ? 'text-white/80' : 'text-mauve-400'}`}>
                                            {product.currencySymbol} {s.price.toLocaleString('en-PK')}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stock status */}
                <p className={`text-sm font-sans mb-6 ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                    {product.inStock ? (product.stockCount ? `In Stock — ${product.stockCount} left` : 'In Stock') : 'Out of Stock'}
                </p>

                {/* WhatsApp CTA */}
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full mb-8">
                    Order via WhatsApp
                </a>

                {/* Highlights */}
                {product.highlights?.length > 0 && (
                    <div className="card-beauty p-6 mb-8">
                        <h3 className="font-medium text-mauve-900 mb-3">Key Highlights</h3>
                        <ul className="space-y-2">
                            {product.highlights.map((h, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-mauve-600">
                                    <Check size={15} className="text-blush mt-0.5 flex-shrink-0" />
                                    {h}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Product info badges */}
                {product.productInfo && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {product.productInfo.crueltyFree && <Badge icon={<Leaf size={13} />} label="Cruelty-Free" />}
                        {product.productInfo.vegan && <Badge icon={<Leaf size={13} />} label="Vegan" />}
                        {!product.productInfo.paraben && <Badge icon={<ShieldCheck size={13} />} label="Paraben-Free" />}
                        {product.productInfo.waterproof && <Badge icon={<Droplet size={13} />} label="Waterproof" />}
                        {product.productInfo.longLasting && <Badge icon={<Check size={13} />} label={`${product.productInfo.longLasting} Wear`} />}
                    </div>
                )}

                {/* Delivery info */}
                {product.deliveryInfo && (
                    <div className="border-t border-mauve-100 pt-6 space-y-2 text-sm text-mauve-600 font-sans">
                        <p className="flex items-center gap-2"><Truck size={14} className="text-blush" /> {product.deliveryInfo.estimatedDays}</p>
                        {product.deliveryInfo.freeShippingThreshold && (
                            <p>Free shipping on orders over {product.currencySymbol} {product.deliveryInfo.freeShippingThreshold.toLocaleString('en-PK')}</p>
                        )}
                        {product.deliveryInfo.returnPolicy && <p>{product.deliveryInfo.returnPolicy}</p>}
                    </div>
                )}
            </div>

            {/* Description tabs */}
            <div className="lg:col-span-2 border-t border-mauve-100 pt-10">
                <div className="flex gap-6 border-b border-mauve-100 mb-6 overflow-x-auto">
                    {DESCRIPTION_TABS.filter(t => product.description?.[t.key]).map(t => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setDescTab(t.key)}
                            className={`pb-3 text-sm font-sans tracking-wide uppercase whitespace-nowrap border-b-2 transition-colors ${descTab === t.key ? 'border-blush text-blush' : 'border-transparent text-mauve-500 hover:text-mauve-800'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <p className="text-mauve-700 whitespace-pre-line leading-relaxed max-w-3xl">{product.description?.[descTab]}</p>

                {/* Ingredients list */}
                {product.ingredientsList?.length > 0 && (
                    <div className="mt-10">
                        <h3 className="font-serif text-xl text-mauve-950 mb-4">Key Ingredients</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {product.ingredientsList.map((ing, i) => (
                                <div key={i} className="flex items-center justify-between border border-mauve-100 rounded-lg px-4 py-3">
                                    <div>
                                        <p className="font-medium text-sm text-mauve-900">{ing.name}</p>
                                        <p className="text-xs text-mauve-500">{ing.purpose}</p>
                                    </div>
                                    {ing.percentage && <span className="text-xs font-sans text-blush">{ing.percentage}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FAQs */}
                {product.faqs?.length > 0 && (
                    <div className="mt-12">
                        <h3 className="font-serif text-xl text-mauve-950 mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-2 max-w-3xl">
                            {product.faqs.map((faq, i) => (
                                <div key={i} className="border border-mauve-100 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-mauve-900"
                                    >
                                        {faq.question}
                                        {openFaq === i ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                    </button>
                                    {openFaq === i && (
                                        <p className="px-4 pb-4 text-sm text-mauve-600">{faq.answer}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews */}
                <div className="mt-12">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                        <h3 className="font-serif text-xl text-mauve-950">Customer Reviews</h3>
                        <button
                            type="button"
                            onClick={() => { setShowReviewForm(v => !v); setReviewSuccess(false) }}
                            className="text-sm font-sans font-medium px-4 py-2 border border-blush text-blush rounded-lg hover:bg-blush hover:text-white transition-colors"
                        >
                            {showReviewForm ? 'Cancel' : 'Write a Review'}
                        </button>
                    </div>

                    {reviewSuccess && (
                        <p className="text-sm text-green-600 mb-4">Thanks! Your review has been posted.</p>
                    )}

                    {showReviewForm && (
                        <form onSubmit={handleReviewSubmit} className="card-beauty p-6 mb-8 max-w-3xl space-y-4">
                            <div>
                                <label className="block text-sm font-sans font-medium text-mauve-700 mb-2">Your Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                                            aria-label={`${n} star`}
                                        >
                                            <Star
                                                size={22}
                                                className={n <= reviewForm.rating ? 'fill-blush text-blush' : 'text-mauve-200'}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-sans font-medium text-mauve-700 mb-2">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={reviewForm.author}
                                        onChange={e => setReviewForm(f => ({ ...f, author: e.target.value }))}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-sans font-medium text-mauve-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={reviewForm.location}
                                        onChange={e => setReviewForm(f => ({ ...f, location: e.target.value }))}
                                        className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-sans font-medium text-mauve-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={reviewForm.title}
                                    onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-sans font-medium text-mauve-700 mb-2">Review *</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={reviewForm.comment}
                                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                                    className="w-full px-4 py-2 border border-mauve-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush"
                                />
                            </div>
                            {reviewError && <p className="text-sm text-red-500">{reviewError}</p>}
                            <button
                                type="submit"
                                disabled={reviewSubmitting}
                                className="btn-primary px-6 py-2.5 disabled:opacity-50"
                            >
                                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    {reviews.length > 0 ? (
                        <div className="space-y-4 max-w-3xl">
                            {reviews.map(r => (
                                <div key={r.id} className="border-b border-mauve-100 pb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-blush text-xs">{'★'.repeat(r.rating)}</span>
                                        <span className="text-sm font-medium text-mauve-900">{r.author}</span>
                                        {r.verified && <span className="text-[10px] text-green-600 font-sans">Verified</span>}
                                        {r.location && <span className="text-xs text-mauve-400 ml-auto">{r.location}</span>}
                                    </div>
                                    {r.title && <p className="text-sm font-medium text-mauve-800 mb-1">{r.title}</p>}
                                    <p className="text-sm text-mauve-600">{r.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !showReviewForm && <p className="text-sm text-mauve-500">No reviews yet. Be the first to share your feedback!</p>
                    )}
                </div>

            </div>
        </div>
    )
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 bg-mauve-50 text-mauve-700 border border-mauve-200 rounded-full">
            {icon} {label}
        </span>
    )
}
