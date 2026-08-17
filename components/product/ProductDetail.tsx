'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, Truck, ShieldCheck, Leaf, Droplet, ChevronDown, ChevronUp } from 'lucide-react'
import { Product } from '@/types/product'
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

    const shade = product.colors[shadeIndex]
    const images = shade?.images?.length ? shade.images : product.colors[0]?.images ?? []
    const discountPct = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

    const whatsappHref = buildProductWhatsAppLink(product, {
        shade: shade?.name,
        size: sizeLabel,
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

                {product.averageRating > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-blush text-sm">{'★'.repeat(Math.round(product.averageRating))}</span>
                        <span className="text-sm text-mauve-500">{product.averageRating.toFixed(1)} ({product.totalReviews} reviews)</span>
                    </div>
                )}

                <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-3xl font-bold text-mauve-900">{product.currencySymbol} {product.price.toLocaleString('en-PK')}</span>
                    {product.originalPrice && (
                        <span className="text-lg text-mauve-400 line-through">{product.currencySymbol} {product.originalPrice.toLocaleString('en-PK')}</span>
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

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-sans font-medium text-mauve-700 mb-2">Size</h3>
                        <div className="flex gap-2 flex-wrap">
                            {product.sizes.map(s => (
                                <button
                                    key={s.label}
                                    type="button"
                                    disabled={!s.available}
                                    onClick={() => setSizeLabel(s.label)}
                                    className={`px-4 py-2 text-sm font-sans border transition-colors ${!s.available ? 'border-mauve-100 text-mauve-300 cursor-not-allowed line-through' :
                                            sizeLabel === s.label ? 'border-blush bg-blush text-white' : 'border-mauve-200 text-mauve-700 hover:border-blush'
                                        }`}
                                >
                                    {s.label}
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
                {product.reviews?.length > 0 && (
                    <div className="mt-12">
                        <h3 className="font-serif text-xl text-mauve-950 mb-4">Customer Reviews</h3>
                        <div className="space-y-4 max-w-3xl">
                            {product.reviews.map(r => (
                                <div key={r.id} className="border-b border-mauve-100 pb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-blush text-xs">{'★'.repeat(r.rating)}</span>
                                        <span className="text-sm font-medium text-mauve-900">{r.author}</span>
                                        {r.verified && <span className="text-[10px] text-green-600 font-sans">Verified</span>}
                                        <span className="text-xs text-mauve-400 ml-auto">{r.location}</span>
                                    </div>
                                    {r.title && <p className="text-sm font-medium text-mauve-800 mb-1">{r.title}</p>}
                                    <p className="text-sm text-mauve-600">{r.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
