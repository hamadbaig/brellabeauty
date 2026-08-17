export interface ProductColor {
  name: string
  hex: string
  images: string[]
  videoUrl?: string
}

export interface ProductSize {
  label: string
  price?: number
  originalPrice?: number
  available: boolean
}

export interface ProductReview {
  id: string
  author: string
  location: string
  rating: number
  date: string
  title: string
  comment: string
  verified: boolean
  photo?: string
  helpful: number
}

export interface ProductFAQItem {
  question: string
  answer: string
}

export interface Ingredient {
  name: string
  purpose: string
  percentage?: string
}

export interface ProductInfo {
  crueltyFree: boolean
  vegan: boolean
  paraben: boolean
  waterproof: boolean
  longLasting?: string
  skinType: string[]
}

export interface Product {
  id: string
  slug: string
  name: string
  collection: string
  sku: string
  price: number
  originalPrice?: number
  currency: string
  currencySymbol: string
  inStock: boolean
  stockCount?: number
  category: string
  subcategory?: string
  finish?: string
  highlights: string[]
  colors: ProductColor[]
  sizes?: ProductSize[]
  description: {
    overview: string
    ingredients: string
    howToUse: string
    benefits: string
  }
  ingredientsList: Ingredient[]
  productInfo: ProductInfo
  deliveryInfo: {
    estimatedDays: string
    regions: string[]
    returnPolicy: string
    exchangePolicy: string
    freeShippingThreshold?: number
  }
  faqs: ProductFAQItem[]
  reviews: ProductReview[]
  averageRating: number
  totalReviews: number
  relatedProductIds: string[]
  tags: string[]
  whatsappNumber: string
  metaTitle?: string
  metaDescription?: string
}
