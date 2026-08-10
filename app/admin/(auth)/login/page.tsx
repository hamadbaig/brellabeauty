'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error ?? 'Login failed'); return }
            router.push('/admin')
            router.refresh()
        } catch {
            setError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="text-white" size={28} />
                    <h1 className="font-serif text-4xl tracking-wide text-white">
                        Brella <span className="text-rosegold-100">Beauty</span>
                    </h1>
                    <Sparkles className="text-white" size={28} />
                </div>
                <p className="text-sm text-white/80 tracking-wider uppercase">Admin Panel</p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">Welcome Back</h2>
                <p className="text-sm text-gray-500 mb-6">Enter your credentials to access the admin panel.</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                        <input
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush focus:border-transparent"
                            placeholder="admin@brellabeauty.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPw ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blush focus:border-transparent"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(p => !p)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blush to-blush-600 text-white text-sm font-semibold rounded-lg hover:from-blush-600 hover:to-blush-700 transition-all disabled:opacity-60 shadow-beauty mt-2"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>
            </div>

            <p className="text-center text-sm text-white/70 mt-6">
                Default: admin@brellabeauty.com / admin123
            </p>
        </div>
    )
}
