import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ShopProductCard from '@/components/shop/ShopProductCard'
import { getCollectionsOverview } from '@/lib/collections.server'

export const dynamic = 'force-dynamic'

export function generateMetadata() {
    return {
        title: 'Collections — Brella Beauty',
        description: 'Explore every Brella Beauty category and subcategory — lip gloss, face makeup, skincare and more.',
    }
}

export default async function CollectionsPage() {
    const collections = await getCollectionsOverview()

    return (
        <>
            <Header variant="light" />
            <main className="min-h-screen bg-pearl pt-20 sm:pt-24 pb-20">

                <div className="border-b border-mauve-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <p className="label-blush mb-1">Explore</p>
                        <h1 className="font-serif text-3xl sm:text-4xl text-mauve-950">All Collections</h1>
                        <p className="text-mauve-500 text-sm font-sans mt-2">Browse every category, subcategory and product we offer.</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">
                    {collections.length === 0 && (
                        <p className="text-center text-mauve-400 py-20">No categories have been added yet.</p>
                    )}

                    {collections.map(cat => (
                        <section key={cat.slug}>
                            {/* Category header */}
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    {cat.image && (
                                        <img src={cat.image} alt={cat.name} className="w-16 h-16 rounded-lg object-cover border border-mauve-200" />
                                    )}
                                    <div>
                                        <h2 className="font-serif text-2xl sm:text-3xl text-mauve-950">{cat.name}</h2>
                                        {cat.description && <p className="text-sm font-sans text-mauve-500 mt-1 max-w-xl">{cat.description}</p>}
                                    </div>
                                </div>
                                <Link
                                    href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                    className="inline-flex items-center gap-1 text-xs font-sans tracking-widest uppercase text-blush hover:text-blush-700 whitespace-nowrap"
                                >
                                    View All ({cat.totalProducts}) <ChevronRight size={13} />
                                </Link>
                            </div>

                            {/* Subcategory chips */}
                            {cat.subcategories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {cat.subcategories.map(sub => (
                                        <Link
                                            key={sub.slug}
                                            href={`/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                                            className="text-xs font-sans px-3 py-1.5 border border-mauve-200 text-mauve-700 hover:border-blush hover:text-blush transition-colors rounded-full"
                                        >
                                            {sub.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Product preview grid */}
                            {cat.products.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {cat.products.map((p, i) => (
                                        <ShopProductCard key={p.id} product={p} index={i} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-mauve-400 font-sans">No products in this category yet.</p>
                            )}
                        </section>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    )
}
