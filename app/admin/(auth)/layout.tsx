export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blush-600 via-rosegold-500 to-mauve-600 flex items-center justify-center p-4">
            {children}
        </div>
    )
}
