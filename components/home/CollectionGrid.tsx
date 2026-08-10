// Placeholder - Copy from Qyra Noor
export default function CollectionGrid({ categories }: any) {
    return (
        <section id="collections" className="py-20 px-6">
            <div className="container mx-auto">
                <h2 className="font-serif text-4xl text-center mb-12">Shop by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories?.map((cat: any) => (
                        <a key={cat.slug} href={`/shop?category=${cat.slug}`} className="group">
                            <div className="aspect-square bg-pearl rounded-lg overflow-hidden mb-4">
                                {cat.image && <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />}
                            </div>
                            <h3 className="font-medium text-lg text-center group-hover:text-blush">{cat.name}</h3>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
