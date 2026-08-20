import 'server-only'
import { connectDB } from './mongodb'
import { HomepageContentModel } from '@/models/HomepageContent'

const COLLECTION_NAME = 'Brella Beauty'

const DEFAULT_CONTENT = {
  collection: COLLECTION_NAME,
  hero: {
    heading: 'Brella Beauty',
    subheading: 'Premium Beauty Products Crafted with Elegance',
    badge: 'Luxury Beauty',
    ctaText: 'Shop Collection',
    backgroundImage: 'https://images.unsplash.com/photo-1596462502278-af407713ca9f?w=1920&q=80',
  },
  featuredCollections: [
    {
      id: 'lipgloss',
      title: 'Luxury Lip Gloss',
      description: 'Premium lip gloss collection with vibrant colors',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      link: '/shop',
      bgColor: '#fce7f3',
      textColor: '#1a1a1a',
      order: 1,
    },
    {
      id: 'skincare',
      title: 'Skincare Essentials',
      description: 'Natural skincare products for radiant skin',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
      link: '/shop',
      bgColor: '#f3e8ff',
      textColor: '#1a1a1a',
      order: 2,
    },
    {
      id: 'makeup',
      title: 'Makeup Collection',
      description: 'Complete makeup range for every occasion',
      image: 'https://images.unsplash.com/photo-1585708372514-56d002e6ec21?w=800&q=80',
      link: '/shop',
      bgColor: '#fef3c7',
      textColor: '#1a1a1a',
      order: 3,
    },
  ],
  features: [
    { id: 'quality', title: 'Premium Quality', description: 'Handcrafted with the finest ingredients', icon: 'Sparkles', order: 1 },
    { id: 'cruelty', title: 'Cruelty Free', description: 'Never tested on animals, 100% ethical', icon: 'Heart', order: 2 },
    { id: 'vegan', title: 'Vegan Formulas', description: 'Plant-based and eco-friendly ingredients', icon: 'Leaf', order: 3 },
    { id: 'shipping', title: 'Fast Shipping', description: 'Quick delivery across Pakistan', icon: 'Truck', order: 4 },
  ],
  testimonials: [
    {
      id: 'testimonial-1',
      name: 'Amina Khan',
      role: 'Beauty Enthusiast',
      text: 'Brella Beauty products are absolutely amazing! The quality is exceptional and the packaging is so elegant.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      rating: 5,
      isOriginal: false,
      order: 1,
    },
    {
      id: 'testimonial-2',
      name: 'Zara Ahmed',
      role: 'Makeup Artist',
      text: 'I use Brella Beauty products in my salon and my clients love them. Highly recommended!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rating: 5,
      isOriginal: false,
      order: 2,
    },
    {
      id: 'testimonial-3',
      name: 'Fatima Malik',
      role: 'Skincare Expert',
      text: 'The natural ingredients and cruelty-free approach is what drew me in, and the results speak for themselves!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      rating: 5,
      isOriginal: false,
      order: 3,
    },
  ],
  brandStory: {
    badge: 'Our Story',
    heading: 'Crafted With Passion & Purpose',
    body: 'Every Brella Beauty product begins with a simple belief: beauty should be elegant, ethical, and effortless. From our first lip gloss to our full skincare line, we pour craftsmanship and care into every drop — so you always feel as good as you look.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80',
    ctaText: 'Discover Our Journey',
    ctaLink: '/shop',
  },
  whyUs: {
    heading: 'The Brella Beauty Difference',
    subheading: 'Numbers that reflect our commitment to you',
    stats: [
      { id: 'customers', label: 'Happy Customers', value: '10K+', icon: 'Users', order: 1 },
      { id: 'reviews', label: '5-Star Reviews', value: '500+', icon: 'Star', order: 2 },
      { id: 'crueltyfree', label: 'Cruelty Free', value: '100%', icon: 'Heart', order: 3 },
      { id: 'products', label: 'Products Crafted', value: '50+', icon: 'Sparkles', order: 4 },
    ],
  },
  cta: {
    heading: 'Ready to Elevate Your Beauty Routine?',
    subheading: 'Join thousands of satisfied customers enjoying premium beauty products',
    ctaText: 'Shop Now',
    secondaryCtaText: 'Contact Us',
    backgroundImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
  },
  marqueeText: 'Premium Quality • Cruelty Free • Vegan Formulas • Handcrafted • Fast Shipping •',
  sections: [
    { key: 'hero', isActive: true, order: 1 },
    { key: 'marquee', isActive: true, order: 2 },
    { key: 'collections', isActive: true, order: 3 },
    { key: 'brandStory', isActive: true, order: 4 },
    { key: 'features', isActive: true, order: 5 },
    { key: 'whyUs', isActive: true, order: 6 },
    { key: 'testimonials', isActive: true, order: 7 },
    { key: 'cta', isActive: true, order: 8 },
  ],
}

// Sections/fields added after initial launch — merged in for documents saved before they existed.
export function withHomepageDefaults(doc: Record<string, any>): Record<string, unknown> {
  return {
    ...DEFAULT_CONTENT,
    ...doc,
    hero: { ...DEFAULT_CONTENT.hero, ...(doc.hero || {}) },
    cta: { ...DEFAULT_CONTENT.cta, ...(doc.cta || {}) },
    brandStory: { ...DEFAULT_CONTENT.brandStory, ...(doc.brandStory || {}) },
    whyUs: {
      ...DEFAULT_CONTENT.whyUs,
      ...(doc.whyUs || {}),
      stats: doc.whyUs?.stats?.length ? doc.whyUs.stats : DEFAULT_CONTENT.whyUs.stats,
    },
    sections: doc.sections?.length ? doc.sections : DEFAULT_CONTENT.sections,
  }
}

// Fetches homepage content, seeding it with sensible defaults the first time it's ever requested.
export async function getHomepageContent(): Promise<Record<string, unknown>> {
  await connectDB()
  const existing = await HomepageContentModel.findOne({ collection: COLLECTION_NAME }).lean<Record<string, unknown>>()
  if (existing) return withHomepageDefaults(existing)

  const created = await HomepageContentModel.create(DEFAULT_CONTENT)
  return created.toObject()
}
