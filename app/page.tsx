import { getAllProducts } from '@/lib/products.server'
import { getHomepageContent } from '@/lib/homepage.server'
import type { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import MarqueeTicker from '@/components/home/MarqueeTicker'
import FeaturedCollections from '@/components/home/FeaturedCollectionsNew'
import BrandStory from '@/components/home/BrandStory'
import FeaturesSection from '@/components/home/FeaturesSection'
import WhyUs from '@/components/home/WhyUs'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTASection from '@/components/home/CTASection'
import WhatsAppCTA from '@/components/home/WhatsAppCTA'

export const revalidate = 60

export const metadata = {
    title: 'Brella Beauty — Premium Beauty Products | Luxury Lip Gloss & Makeup Pakistan',
    description:
        'Discover handcrafted luxury beauty products by Brella Beauty — where elegance meets excellence. Premium lip gloss, makeup & skincare. Cruelty-free & vegan. Shop via WhatsApp.',
}

const DEFAULT_SECTIONS = [
    { key: 'hero', isActive: true, order: 1 },
    { key: 'marquee', isActive: true, order: 2 },
    { key: 'collections', isActive: true, order: 3 },
    { key: 'brandStory', isActive: true, order: 4 },
    { key: 'features', isActive: true, order: 5 },
    { key: 'whyUs', isActive: true, order: 6 },
    { key: 'testimonials', isActive: true, order: 7 },
    { key: 'cta', isActive: true, order: 8 },
]

export default async function HomePage() {
    const [products, hp] = await Promise.all([
        getAllProducts(),
        getHomepageContent(),
    ]) as [Awaited<ReturnType<typeof getAllProducts>>, any]

    // Real customer reviews left on product pages, surfaced as homepage testimonials.
    const productReviews = products
        .flatMap(p => (p.reviews || []).map(r => ({
            id: r.id,
            name: r.author,
            role: `Verified Buyer · ${p.name}`,
            text: r.comment,
            image: r.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author)}&background=ec659b&color=fff`,
            rating: r.rating,
            isOriginal: true,
            isActive: true,
            order: 0,
            date: r.date,
        })))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 12)

    const combinedTestimonials = [...(hp.testimonials || []), ...productReviews]

    const sectionMap: Record<string, ReactNode> = {
        hero: <HeroSection settings={hp.hero} />,
        marquee: <MarqueeTicker text={hp.marqueeText} />,
        collections: <FeaturedCollections collections={hp.featuredCollections} />,
        brandStory: <BrandStory settings={hp.brandStory} />,
        features: <FeaturesSection features={hp.features} />,
        whyUs: <WhyUs settings={hp.whyUs} />,
        testimonials: <TestimonialsSection testimonials={combinedTestimonials} />,
        cta: <CTASection settings={hp.cta} />,
    }

    const orderedSections = (hp.sections?.length ? hp.sections : DEFAULT_SECTIONS)
        .filter((s: any) => s.isActive !== false)
        .sort((a: any, b: any) => a.order - b.order)

    return (
        <>
            <Header variant="dark" />
            <main className="min-h-screen">
                {orderedSections.map((s: any) => (
                    <div key={s.key}>{sectionMap[s.key]}</div>
                ))}

                {/* WhatsApp CTA */}
                <WhatsAppCTA />
            </main>
            <Footer />
        </>
    )
}
