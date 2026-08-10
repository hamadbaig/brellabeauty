// Placeholder - Copy from Qyra Noor and adapt for beauty branding
'use client'
export default function AdminSidebar() {
    return (
        <aside className="w-64 bg-gradient-to-b from-blush-600 to-rosegold-600 text-white p-6">
            <div className="mb-8">
                <h1 className="font-serif text-2xl tracking-wide">Brella Beauty</h1>
                <p className="text-xs text-white/70 mt-1">Admin Panel</p>
            </div>
            <nav className="space-y-2">
                <a href="/admin" className="block px-4 py-2 rounded-lg hover:bg-white/10">Dashboard</a>
                <a href="/admin/products" className="block px-4 py-2 rounded-lg hover:bg-white/10">Products</a>
                <a href="/admin/categories" className="block px-4 py-2 rounded-lg hover:bg-white/10">Categories</a>
                <a href="/admin/subcategories" className="block px-4 py-2 rounded-lg hover:bg-white/10">Subcategories</a>
                <a href="/admin/homepage" className="block px-4 py-2 rounded-lg hover:bg-white/10">Homepage</a>
            </nav>
        </aside>
    )
}
