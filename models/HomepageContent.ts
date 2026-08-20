import mongoose, { Schema, Model } from 'mongoose'

const HeroSectionSchema = new Schema({
  heading: { type: String, default: 'Brella Beauty' },
  subheading: { type: String, default: 'Premium Beauty Products' },
  badge: { type: String, default: 'Luxury Beauty' },
  ctaText: { type: String, default: 'Shop Now' },
  backgroundImage: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { _id: false })

const FeaturedCollectionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  link: { type: String, default: '/shop' },
  bgColor: { type: String, default: '#f5e6d3' },
  textColor: { type: String, default: '#1a1a1a' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false })

const TestimonialSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'Customer' },
  text: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  // Real customer testimonials are prioritized over placeholder/dummy ones on the storefront.
  isOriginal: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false })

const BrandStorySchema = new Schema({
  badge: { type: String, default: 'Our Story' },
  heading: { type: String, default: 'Crafted With Passion & Purpose' },
  body: { type: String, default: 'Every Brella Beauty product begins with a simple belief: beauty should be elegant, ethical, and effortless. From our first lip gloss to our full skincare line, we pour craftsmanship and care into every drop.' },
  image: { type: String, default: '' },
  ctaText: { type: String, default: 'Discover Our Journey' },
  ctaLink: { type: String, default: '/shop' },
  isActive: { type: Boolean, default: true },
}, { _id: false })

const WhyUsStatSchema = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, default: 'Sparkles' },
  order: { type: Number, default: 0 },
}, { _id: false })

const WhyUsSchema = new Schema({
  heading: { type: String, default: 'The Brella Beauty Difference' },
  subheading: { type: String, default: 'Numbers that reflect our commitment to you' },
  stats: [WhyUsStatSchema],
  isActive: { type: Boolean, default: true },
}, { _id: false })

const SectionConfigSchema = new Schema({
  key: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false })

const FeatureSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Sparkles' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false })

const CTASectionSchema = new Schema({
  heading: { type: String, default: 'Ready to Transform Your Beauty Routine?' },
  subheading: { type: String, default: 'Join thousands of satisfied customers' },
  ctaText: { type: String, default: 'Shop Now' },
  secondaryCtaText: { type: String, default: 'Contact Us' },
  backgroundImage: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { _id: false })

const HomepageContentSchema = new Schema({
  collection: { 
    type: String, 
    default: 'Brella Beauty',
    unique: true,
  },
  hero: {
    type: HeroSectionSchema,
    default: {},
  },
  featuredCollections: [FeaturedCollectionSchema],
  features: [FeatureSchema],
  testimonials: [TestimonialSchema],
  brandStory: {
    type: BrandStorySchema,
    default: {},
  },
  whyUs: {
    type: WhyUsSchema,
    default: {},
  },
  cta: {
    type: CTASectionSchema,
    default: {},
  },
  marqueeText: { type: String, default: 'Luxury Beauty • Cruelty Free • Handcrafted •' },
  // Controls which homepage sections are shown and in what order.
  sections: [SectionConfigSchema],
  isPublished: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false })

export const HomepageContentModel: Model<any> =
  mongoose.models.HomepageContent ?? mongoose.model('HomepageContent', HomepageContentSchema)
