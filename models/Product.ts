import mongoose, { Schema, Model } from 'mongoose'

const ColorSchema = new Schema({
  name:     { type: String, required: true },
  hex:      { type: String, required: true },
  images:   [{ type: String }],
  videoUrl: { type: String },
}, { _id: false })

const SizeSchema = new Schema({
  label:     { type: String, required: true },
  available: { type: Boolean, default: true },
}, { _id: false })

const ReviewSchema = new Schema({
  id:       { type: String, required: true },
  author:   String,
  location: String,
  rating:   Number,
  date:     String,
  title:    String,
  comment:  String,
  verified: { type: Boolean, default: false },
  photo:    String,
  helpful:  { type: Number, default: 0 },
}, { _id: false })

const FAQSchema = new Schema({
  question: String,
  answer:   String,
}, { _id: false })

const IngredientSchema = new Schema({
  name:        String,
  purpose:     String,
  percentage:  String,
}, { _id: false })

const ProductSchema = new Schema({
  id:              { type: String, required: true, unique: true, index: true },
  slug:            { type: String, required: true, unique: true, index: true },
  name:            { type: String, required: true },
  collection:      { type: String, required: true },
  sku:             { type: String, required: true, unique: true },
  price:           { type: Number, required: true },
  originalPrice:   { type: Number },
  currency:        { type: String, default: 'PKR' },
  currencySymbol:  { type: String, default: 'PKR' },
  inStock:         { type: Boolean, default: true },
  stockCount:      { type: Number },
  category:        { type: String, required: true },
  subcategory:     { type: String },
  finish:          { type: String }, // Matte, Glossy, Satin, Shimmer, etc.
  highlights:      [{ type: String }],
  colors:          [ColorSchema],
  sizes:           [SizeSchema], // For skincare/sets
  description: {
    overview:              { type: String, default: '' },
    ingredients:           { type: String, default: '' },
    howToUse:              { type: String, default: '' },
    benefits:              { type: String, default: '' },
  },
  ingredientsList:   [IngredientSchema],
  productInfo: {
    crueltyFree:    { type: Boolean, default: true },
    vegan:          { type: Boolean, default: false },
    paraben:        { type: Boolean, default: false },
    waterproof:     { type: Boolean, default: false },
    longLasting:    { type: String }, // e.g., "8+ hours"
    skinType:       [{ type: String }], // All, Oily, Dry, Combination, Sensitive
  },
  deliveryInfo: {
    estimatedDays:          { type: String },
    regions:                [{ type: String }],
    returnPolicy:           { type: String },
    exchangePolicy:         { type: String },
    freeShippingThreshold:  { type: Number },
  },
  faqs:              [FAQSchema],
  reviews:           [ReviewSchema],
  averageRating:     { type: Number, default: 0 },
  totalReviews:      { type: Number, default: 0 },
  relatedProductIds: [{ type: String }],
  tags:              [{ type: String }],
  whatsappNumber:    { type: String, required: true },
  metaTitle:         { type: String },
  metaDescription:   { type: String },
}, {
  timestamps: true,
  versionKey: false,
})

export const ProductModel: Model<any> =
  mongoose.models.Product ?? mongoose.model('Product', ProductSchema)
