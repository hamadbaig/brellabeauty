'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ArrowUpDown } from 'lucide-react'

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
]

interface Props {
    current: string
    total: number
}

export default function ShopSort({ current, total }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()
    const [, start] = useTransition()

    const setSort = (sort: string) => {
        const sp = new URLSearchParams(params.toString())
        sp.set('sort', sort)
        sp.delete('page')
        start(() => router.push(`${pathname}?${sp.toString()}`))
    }

    return (
        <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm font-sans text-mauve-500">
                <span className="font-semibold text-mauve-900">{total}</span> product{total !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
                <ArrowUpDown size={13} className="text-mauve-400" />
                <select
                    value={current}
                    onChange={e => setSort(e.target.value)}
                    className="text-sm font-sans text-mauve-700 border border-mauve-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blush bg-white cursor-pointer"
                >
                    {SORT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}
