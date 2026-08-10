import type { Metadata } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    weight: ['400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
})

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        default: 'Brella Beauty — Luxury Beauty Products Pakistan',
        template: '%s | Brella Beauty',
    },
    description: 'Discover premium beauty products at Brella Beauty. Luxury lip gloss, makeup, and skincare crafted with the finest ingredients. Cruelty-free & vegan-friendly.',
    keywords: ['lip gloss', 'beauty products', 'luxury makeup', 'brella beauty', 'Pakistani beauty', 'cruelty-free', 'vegan makeup'],
    openGraph: {
        type: 'website',
        locale: 'en_PK',
        siteName: 'Brella Beauty',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${playfair.variable} ${montserrat.variable}`}>
            <body className="bg-pearl min-h-screen antialiased" suppressHydrationWarning>{children}</body>
        </html>
    )
}
