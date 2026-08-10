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
  cta: {
    type: CTASectionSchema,
    default: {},
  },
  marqueeText: { type: String, default: 'Luxury Beauty • Cruelty Free • Handcrafted •' },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false })

export const HomepageContentModel: Model<any> =
  mongoose.models.HomepageContent ?? mongoose.model('HomepageContent', HomepageContentSchema)
