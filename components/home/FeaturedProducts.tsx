// Placeholder - Copy from Qyra Noor
export default function FeaturedProducts({ products }: any) {
    return (
        <section className="py-20 px-6 bg-pearl">
            <div className="container mx-auto">
                <h2 className="font-serif text-4xl text-center mb-12">Featured Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {products?.slice(0, 4).map((product: any) => (
                        <a key={product.id} href={`/products/${product.slug}`} className="group">
                            <div className="bg-white rounded-lg overflow-hidden shadow-beauty">
                                <div className="aspect-square overflow-hidden">
                                    {product.colors?.[0]?.images?.[0] && (
                                        <img src={product.colors[0].images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-sm mb-1 group-hover:text-blush">{product.name}</h3>
                                    <p className="text-blush font-semibold">PKR {product.price?.toLocaleString()}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
