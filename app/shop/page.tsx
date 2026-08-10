// Placeholder - Copy from Qyra Noor and adapt
import { getAllProducts } from '@/lib/products.server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
    title: 'Shop All Products — Brella Beauty',
    description: 'Browse our complete collection of luxury beauty products. Lip gloss, makeup, and skincare.',
}

export default async function ShopPage() {
    const products = await getAllProducts()

    return (
        <>
            <Header />
            <main className="min-h-screen py-20 px-6">
                <div className="container mx-auto">
                    <h1 className="font-serif text-5xl text-center mb-12">Shop All Products</h1>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {products.map(product => (
                            <a key={product.id} href={`/products/${product.slug}`} className="group">
                                <div className="bg-white rounded-lg overflow-hidden shadow-beauty hover:shadow-beauty-lg transition-shadow">
                                    <div className="aspect-square overflow-hidden">
                                        {product.colors?.[0]?.images?.[0] && (
                                            <img
                                                src={product.colors[0].images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-base mb-2 group-hover:text-blush transition-colors">{product.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-blush font-bold text-lg">PKR {product.price?.toLocaleString()}</p>
                                            {product.originalPrice && (
                                                <p className="text-gray-400 line-through text-sm">PKR {product.originalPrice?.toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
