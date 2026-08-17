import 'server-only'
import { connectDB } from './mongodb'
import { CategoryModel } from '@/models/Category'
import { SubcategoryModel } from '@/models/Subcategory'
import { ProductModel } from '@/models/Product'
import { Product } from '@/types/product'

function toProduct(doc: Record<string, unknown>): Product {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...rest } = doc
  return rest as unknown as Product
}

export interface CategoryOverview {
  name: string
  slug: string
  description: string
  image: string
  subcategories: { name: string; slug: string; description: string }[]
  products: Product[]
  totalProducts: number
}

const PREVIEW_LIMIT = 4

export async function getCollectionsOverview(): Promise<CategoryOverview[]> {
  await connectDB()

  const [categories, subcategories] = await Promise.all([
    CategoryModel.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean<any[]>(),
    SubcategoryModel.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean<any[]>(),
  ])

  return Promise.all(
    categories.map(async (cat) => {
      const [products, totalProducts] = await Promise.all([
        ProductModel.find({ category: cat.name }).sort({ createdAt: -1 }).limit(PREVIEW_LIMIT).lean<Record<string, unknown>[]>(),
        ProductModel.countDocuments({ category: cat.name }),
      ])

      return {
        name: cat.name,
        slug: cat.slug,
        description: cat.description ?? '',
        image: cat.image ?? '',
        subcategories: subcategories
          .filter(s => s.categorySlug === cat.slug)
          .map(s => ({ name: s.name, slug: s.slug, description: s.description ?? '' })),
        products: products.map(toProduct),
        totalProducts,
      }
    })
  )
}
