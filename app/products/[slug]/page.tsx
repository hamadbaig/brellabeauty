import { getProductBySlug, getAllProductSlugs, getRelatedProducts, getShopProducts } from '@/lib/products.server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductDetail from '@/components/product/ProductDetail'
import ShopProductCard from '@/components/shop/ShopProductCard'

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

    let related = await getRelatedProducts(product.relatedProductIds)
    if (related.length === 0) {
        const sameCategory = await getShopProducts({ category: product.category, limit: 5 })
        related = sameCategory.products.filter(p => p.id !== product.id).slice(0, 4)
    }

    return (
        <>
            <Header variant="light" />
            <main className="min-h-screen bg-pearl pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-mauve-500 mb-8 font-sans">
                        <Link href="/" className="hover:text-blush">Home</Link>
                        <ChevronRight size={13} />
                        <Link href="/shop" className="hover:text-blush">Shop</Link>
                        <ChevronRight size={13} />
                        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-blush">{product.category}</Link>
                        <ChevronRight size={13} />
                        <span className="text-mauve-900">{product.name}</span>
                    </div>

                    <ProductDetail product={product} />

                    {/* Related products */}
                    {related.length > 0 && (
                        <div className="mt-20 border-t border-mauve-100 pt-12">
                            <h2 className="font-serif text-2xl sm:text-3xl text-mauve-950 mb-8">You May Also Like</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                {related.map((p, i) => (
                                    <ShopProductCard key={p.id} product={p} index={i} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
