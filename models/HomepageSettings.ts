import mongoose, { Schema, Model } from 'mongoose'

const HomepageSettingsSchema = new Schema({
  hero: {
    badge:           { type: String, default: 'Luxury Beauty Products' },
    heading:         { type: String, default: 'Where Beauty Meets Elegance' },
    subheading:      { type: String, default: 'Premium lip gloss and beauty essentials crafted for the modern woman — vibrant colors, luxurious formulas, and irresistible shine.' },
    image:           { type: String, default: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&q=80' },
    cta1Text:        { type: String, default: 'Shop Collection' },
    cta1Link:        { type: String, default: '/#collections' },
    whatsappNumber:  { type: String, default: '923347573726' },
    stats: { type: [{ num: String, label: String }], default: [
      { num: '1000+', label: 'Happy Customers' },
      { num: '100+',  label: 'Premium Products' },
      { num: '4.9★', label: 'Average Rating' },
    ]},
  },
  marquee: {
    items: { type: [String], default: [
      'Cruelty-Free Beauty', 'Premium Formulas', 'WhatsApp Easy Ordering',
      'Pakistan-wide Delivery', '7-Day Easy Returns', 'Vegan Options Available',
      'Long-Lasting Formulas', 'Dermatologically Tested',
    ]},
  },
  brandStory: {
    label:      { type: String, default: 'Our Philosophy' },
    heading:    { type: String, default: 'The Brella Beauty Story' },
    paragraphs: { type: [String], default: [
      'Brella Beauty was born from a passion for creating luxury beauty products that make every woman feel confident and beautiful. Founded in Pakistan by beauty enthusiasts and cosmetic experts, we set out to redefine affordable luxury in beauty.',
      'Every product we create begins with sourcing the finest ingredients from around the world. Our expert formulators spend countless hours perfecting each shade, each texture, each finish — because we know that when you look beautiful, you feel unstoppable.',
      'Today, Brella Beauty serves thousands of women across Pakistan and beyond, delivering products that blend modern trends with timeless beauty.',
    ]},
    image:      { type: String, default: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80' },
    badgeNum:   { type: String, default: '5+' },
    badgeLabel: { type: String, default: 'Years of Excellence' },
    stats: { type: [{ num: String, label: String }], default: [
      { num: '1000+', label: 'Customers' },
      { num: '100+',  label: 'Products' },
      { num: '4.9',  label: 'Avg. Rating' },
    ]},
    ctaText: { type: String, default: 'Chat With Our Team' },
    ctaLink: { type: String, default: 'https://wa.me/923347573726' },
  },
  whyUs: {
    label:   { type: String, default: 'The Brella Beauty Difference' },
    heading: { type: String, default: 'Why Choose Us' },
    features: { type: [{ title: String, description: String }], default: [
      { title: 'Premium Formulas',         description: 'Only the finest ingredients for long-lasting, vibrant beauty products.' },
      { title: 'WhatsApp Ordering',        description: 'Order effortlessly via WhatsApp — no apps, no hassle, just instant service.' },
      { title: 'Pakistan-wide Delivery',   description: 'Fast delivery to all major cities in 3–5 business days.' },
      { title: '7-Day Easy Returns',       description: 'Not happy? Return within 7 days with zero questions asked.' },
      { title: 'Cruelty-Free',             description: 'All our products are cruelty-free and many are vegan-friendly.' },
      { title: 'Quality Guaranteed',       description: 'Every product is tested and inspected before dispatch. Excellence is non-negotiable.' },
    ]},
  },
  testimonials: {
    label:   { type: String, default: 'Real Stories' },
    heading: { type: String, default: 'Loved By Our Community' },
    items: { type: [{ author: String, location: String, rating: Number, text: String, avatar: String }], default: [
      { author: 'Ayesha Khan',   location: 'Karachi',     rating: 5, text: '"The Rose Quartz lip gloss is absolutely stunning! The color is perfect and it lasts all day. Brella Beauty is now my go-to brand!"',                                       avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' },
      { author: 'Sana Ahmed',    location: 'Lahore',      rating: 5, text: '"Ordered via WhatsApp and the whole process was seamless. The lip gloss arrived beautifully packaged. Love it!"',                                                           avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
      { author: 'Maria Ali',     location: 'Islamabad',   rating: 5, text: '"Finally found a lip gloss that doesn\'t dry my lips! The formula is so moisturizing and the shine is incredible."',                                                           avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
      { author: 'Zara Malik',    location: 'Dubai, UAE',  rating: 5, text: '"Ordered internationally and was amazed by the quality. The Coral Bliss shade is perfect for my skin tone. Worth every penny!"',                                              avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80' },
    ]},
  },
  whatsappCTA: {
    heading:        { type: String, default: 'Your Perfect Shade\nIs One Message Away' },
    subheading:     { type: String, default: 'Skip the checkout process. Message us directly on WhatsApp to browse our full collection, ask about product details, or place your order in minutes — our team responds within the hour.' },
    whatsappNumber: { type: String, default: '923347573726' },
    ctaMessage:     { type: String, default: "Hi! I'm interested in Brella Beauty products. Could you please share your latest lip gloss collection and available shades?" },
    trustSignals:   { type: [String], default: ['Replies within 1 hour', 'Secure & trusted', 'Pakistan-wide delivery', 'International shipping'] },
  },
}, { timestamps: true, versionKey: false })

export const HomepageSettingsModel: Model<any> =
  mongoose.models.HomepageSettings ?? mongoose.model('HomepageSettings', HomepageSettingsSchema)
