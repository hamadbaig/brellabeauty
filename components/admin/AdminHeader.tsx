// Placeholder - Copy from Qyra Noor and adapt colors
'use client'
export default function AdminHeader({ title }: { title: string }) {
    return (
        <header className="bg-white border-b border-mauve-100 px-6 py-4">
            <h1 className="text-2xl font-serif font-semibold text-gray-800">{title}</h1>
        </header>
    )
}
