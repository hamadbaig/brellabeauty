import { getAllProducts } from '@/lib/products.server'
import { getHomepageContent } from '@/lib/homepage.server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import MarqueeTicker from '@/components/home/MarqueeTicker'
import FeaturedCollections from '@/components/home/FeaturedCollectionsNew'
import FeaturesSection from '@/components/home/FeaturesSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTASection from '@/components/home/CTASection'
import WhatsAppCTA from '@/components/home/WhatsAppCTA'

export const revalidate = 60

export const metadata = {
    title: 'Brella Beauty — Premium Beauty Products | Luxury Lip Gloss & Makeup Pakistan',
    description:
        'Discover handcrafted luxury beauty products by Brella Beauty — where elegance meets excellence. Premium lip gloss, makeup & skincare. Cruelty-free & vegan. Shop via WhatsApp.',
}

export default async function HomePage() {
    const [products, hp] = await Promise.all([
        getAllProducts(),
        getHomepageContent(),
    ]) as [Awaited<ReturnType<typeof getAllProducts>>, any]

    return (
        <>
            <Header variant="dark" />
            <main className="min-h-screen">
                {/* Hero Section */}
                <HeroSection settings={hp.hero} />

                {/* Marquee */}
                <MarqueeTicker text={hp.marqueeText} />

                {/* Featured Collections */}
                <FeaturedCollections collections={hp.featuredCollections} />

                {/* Features/Why Us Section */}
                <FeaturesSection features={hp.features} />

                {/* Testimonials Section */}
                <TestimonialsSection testimonials={hp.testimonials} />

                {/* CTA Section */}
                <CTASection settings={hp.cta} />

                {/* WhatsApp CTA */}
                <WhatsAppCTA />
            </main>
            <Footer />
        </>
    )
}
