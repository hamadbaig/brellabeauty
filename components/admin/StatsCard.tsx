'use client'
import { Package, Tag, Layers, TrendingUp } from 'lucide-react'

interface Props {
    title: string
    value: number
    subtitle: string
    icon: 'package' | 'tag' | 'layers' | 'trending'
    color: string
}

const iconMap = {
    package: Package,
    tag: Tag,
    layers: Layers,
    trending: TrendingUp,
}

export default function StatsCard({ title, value, subtitle, icon, color }: Props) {
    const Icon = iconMap[icon]
    return (
        <div className="bg-white rounded-xl border border-mauve-100 p-6 shadow-beauty">
            <div className="flex items-center justify-between mb-4">
                <Icon size={24} className={`text-${color}`} />
                <span className="text-3xl font-bold text-gray-800">{value}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
            <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
    )
}
