// Placeholder - Copy from Qyra Noor and adapt
export default function Header({ variant }: { variant?: 'dark' | 'light' }) {
    return (
        <header className={`py-4 px-6 ${variant === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="font-serif text-2xl">Brella <span className="text-blush">Beauty</span></h1>
                <nav className="hidden md:flex gap-8">
                    <a href="/" className="hover:text-blush">Home</a>
                    <a href="/shop" className="hover:text-blush">Shop</a>
                    <a href="/#collections" className="hover:text-blush">Collections</a>
                </nav>
            </div>
        </header>
    )
}
