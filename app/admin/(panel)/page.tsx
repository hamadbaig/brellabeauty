import { connectDB } from '@/lib/mongodb'
import { ProductModel } from '@/models/Product'
import { CategoryModel } from '@/models/Category'
import { SubcategoryModel } from '@/models/Subcategory'
import AdminHeader from '@/components/admin/AdminHeader'
import StatsCard from '@/components/admin/StatsCard'
import { Sparkles, Edit3, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
    await connectDB()

    const [productCount, categoryCount, subcategoryCount, recentProducts, inStockCount] = await Promise.all([
        ProductModel.countDocuments(),
        CategoryModel.countDocuments(),
        SubcategoryModel.countDocuments(),
        ProductModel.find({}).sort({ createdAt: -1 }).limit(5).lean<any[]>(),
        ProductModel.countDocuments({ inStock: true }),
    ])

    return (
        <>
            <AdminHeader title="Dashboard" />
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blush-500 to-rosegold-500 rounded-xl p-6 text-white shadow-beauty-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles size={24} />
                        <h2 className="text-2xl font-serif font-semibold">Welcome to Brella Beauty Admin</h2>
                    </div>
                    <p className="text-white/90 text-sm">Manage your beauty products, categories, and homepage content with ease.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard title="Total Products" value={productCount} subtitle={`${inStockCount} in stock`} icon="package" color="blush" />
                    <StatsCard title="Categories" value={categoryCount} subtitle="Active product categories" icon="tag" color="rosegold" />
                    <StatsCard title="Subcategories" value={subcategoryCount} subtitle="Sub-level classifications" icon="layers" color="mauve" />
                    <StatsCard title="In Stock" value={inStockCount} subtitle={`${productCount - inStockCount} out of stock`} icon="trending" color="nude" />
                </div>

                {/* Content Management */}
                <div className="bg-gradient-to-r from-mauve-50 to-pearl rounded-xl p-6 border border-mauve-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Edit3 size={24} className="text-blush" />
                        <h2 className="text-xl font-semibold text-gray-900">Content Management</h2>
                    </div>
                    <Link href="/admin/homepage" className="inline-block px-6 py-2 bg-gradient-to-r from-blush-500 to-rose-400 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                        Edit Homepage
                    </Link>
                </div>

                {/* Recent products */}
                <div className="bg-white rounded-xl border border-mauve-100 shadow-beauty">
                    <div className="px-6 py-4 border-b border-mauve-50 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800">Recent Products</h2>
                        <Link href="/admin/products/new" className="text-xs font-medium text-blush hover:text-blush-600 bg-blush-50 px-3 py-1.5 rounded-lg transition-colors">
                            + Add Product
                        </Link>
                    </div>
                    <div className="divide-y divide-mauve-50">
                        {recentProducts.length === 0 ? (
                            <p className="px-6 py-8 text-sm text-gray-400 text-center">No products yet. <Link href="/admin/products/new" className="text-blush hover:underline">Create your first product.</Link></p>
                        ) : recentProducts.map((p: any) => (
                            <div key={p._id?.toString()} className="px-6 py-3.5 flex items-center gap-4 hover:bg-pearl transition-colors">
                                {p.colors?.[0]?.images?.[0] && (
                                    <img src={p.colors[0].images[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-mauve-100" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                                    <p className="text-xs text-gray-400">PKR {p.price?.toLocaleString('en-PK')} &middot; {p.collection}</p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    {p.inStock
                                        ? <><CheckCircle size={14} className="text-green-500" /><span className="text-xs text-green-600">In stock</span></>
                                        : <><AlertCircle size={14} className="text-red-400" /><span className="text-xs text-red-500">Out of stock</span></>
                                    }
                                </div>
                                <Link href={`/admin/products/${p.id}/edit`} className="text-xs text-blush hover:text-blush-600 transition-colors flex-shrink-0 font-medium">Edit</Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { href: '/admin/products/new', label: 'Add New Product', icon: 'package', color: 'blush' },
                        { href: '/admin/categories/new', label: 'Add Category', icon: 'tag', color: 'rosegold' },
                        { href: '/admin/subcategories/new', label: 'Add Subcategory', icon: 'layers', color: 'mauve' },
                    ].map(({ href, label, icon, color }) => {
                        const iconMap: Record<string, React.ReactNode> = {
                            'package': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4l-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
                            'tag': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="8" cy="8" r="1.5"/></svg>,
                            'layers': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 20 7 20 17 12 22 4 17 4 7 12 2"/><polyline points="12 22 12 12"/><polyline points="20 7 12 12 4 7"/><polyline points="20 17 12 12 4 17"/></svg>,
                        }
                        return (
                            <Link key={href} href={href} className="bg-white rounded-xl border border-mauve-100 p-5 flex items-center gap-4 hover:border-blush hover:shadow-beauty transition-all group">
                                <div className={`w-12 h-12 bg-${color}-50 rounded-xl flex items-center justify-center group-hover:bg-${color}-100 transition-colors text-${color}`}>
                                    {iconMap[icon]}
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blush">{label}</span>
                            </Link>
                        )
                    })}
                </div>
            </main>
        </>
    )
}
