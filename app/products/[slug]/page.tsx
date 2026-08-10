// Placeholder - Copy from Qyra Noor and adapt for beauty products
import { getProductBySlug, getAllProductSlugs } from '@/lib/products.server'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export async function generateStaticParams() {
    const slugs = await getAllProductSlugs()
    return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = await getProductBySlug(slug)
    if (!product) return {}

    return {
        title: product.metaTitle || `${product.name} — Brella Beauty`,
        description: product.metaDescription || product.description.overview.slice(0, 160),
    }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = await getProductBySlug(slug)
    if (!product) notFound()

    return (
        <>
            <Header />
            <main className="min-h-screen py-12 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Image Gallery */}
                        <div>
                            {product.colors?.[0]?.images?.[0] && (
                                <img
                                    src={product.colors[0].images[0]}
                                    alt={product.name}
                                    className="w-full rounded-xl shadow-beauty-lg"
                                />
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 className="font-serif text-4xl mb-4">{product.name}</h1>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl font-bold text-blush">PKR {product.price?.toLocaleString()}</span>
                                {product.originalPrice && (
                                    <span className="text-xl text-gray-400 line-through">PKR {product.originalPrice?.toLocaleString()}</span>
                                )}
                            </div>

                            <p className="text-gray-600 mb-8">{product.description.overview}</p>

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="font-medium mb-3">Available Shades</h3>
                                    <div className="flex gap-3">
                                        {product.colors.map(color => (
                                            <div key={color.name} className="flex flex-col items-center gap-2">
                                                <div
                                                    className="w-12 h-12 rounded-full border-2 border-mauve-200 shadow-sm"
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                                <span className="text-xs text-gray-600">{color.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* WhatsApp CTA */}
                            <a
                                href={`https://wa.me/${product.whatsappNumber}?text=Hi! I'm interested in ${product.name}`}
                                className="btn-whatsapp w-full"
                            >
                                Order via WhatsApp
                            </a>

                            {/* Highlights */}
                            {product.highlights && product.highlights.length > 0 && (
                                <div className="mt-8 bg-pearl rounded-lg p-6">
                                    <h3 className="font-medium mb-3">Key Features</h3>
                                    <ul className="space-y-2">
                                        {product.highlights.map((highlight, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="text-blush">✓</span>
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description Tabs */}
                    <div className="mt-16 bg-white rounded-xl shadow-beauty p-8">
                        <h2 className="font-serif text-2xl mb-6">Product Details</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium text-lg mb-2">Overview</h3>
                                <p className="text-gray-600">{product.description.overview}</p>
                            </div>

                            {product.description.ingredients && (
                                <div>
                                    <h3 className="font-medium text-lg mb-2">Ingredients</h3>
                                    <p className="text-gray-600">{product.description.ingredients}</p>
                                </div>
                            )}

                            {product.description.howToUse && (
                                <div>
                                    <h3 className="font-medium text-lg mb-2">How to Use</h3>
                                    <p className="text-gray-600 whitespace-pre-line">{product.description.howToUse}</p>
                                </div>
                            )}

                            {product.description.benefits && (
                                <div>
                                    <h3 className="font-medium text-lg mb-2">Benefits</h3>
                                    <p className="text-gray-600 whitespace-pre-line">{product.description.benefits}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
