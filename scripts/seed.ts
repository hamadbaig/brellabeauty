import { connectDB } from '../lib/mongodb'
import { ProductModel } from '../models/Product'
import { CategoryModel } from '../models/Category'
import { SubcategoryModel } from '../models/Subcategory'
import { products } from '../lib/products'

async function seed() {
  try {
    await connectDB()
    console.log('✓ Connected to MongoDB')

    // Clear existing data
    await ProductModel.deleteMany({})
    await CategoryModel.deleteMany({})
    await SubcategoryModel.deleteMany({})
    console.log('✓ Cleared existing data')

    // Seed categories
    const categories = [
      {
        name: 'Lip Products',
        slug: 'lip-products',
        description: 'Luxurious lip glosses, lipsticks, and lip care products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Face Makeup',
        slug: 'face-makeup',
        description: 'Foundations, concealers, and highlighters',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Premium skincare essentials',
        image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800&q=80',
        isActive: true,
        sortOrder: 3,
      },
    ]

    await CategoryModel.insertMany(categories)
    console.log('✓ Seeded categories')

    // Seed subcategories
    const subcategories = [
      {
        name: 'Glossy Finish',
        slug: 'glossy-finish',
        categorySlug: 'lip-products',
        description: 'High-shine glossy lip products',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Matte Finish',
        slug: 'matte-finish',
        categorySlug: 'lip-products',
        description: 'Velvety matte lip products',
        isActive: true,
        sortOrder: 2,
      },
    ]

    await SubcategoryModel.insertMany(subcategories)
    console.log('✓ Seeded subcategories')

    // Seed products
    await ProductModel.insertMany(products)
    console.log('✓ Seeded products')

    console.log('\n✓ Database seeded successfully!')
    console.log(`  Categories: ${categories.length}`)
    console.log(`  Subcategories: ${subcategories.length}`)
    console.log(`  Products: ${products.length}`)
    
    process.exit(0)
  } catch (error) {
    console.error('✗ Error seeding database:', error)
    process.exit(1)
  }
}

seed()
