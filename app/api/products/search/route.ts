import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { ProductModel } from '@/models/Product'

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
    if (!q) return NextResponse.json([])

    await connectDB()
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ]
    })
    .select('id slug name category price originalPrice currencySymbol colors')
    .limit(10)
    .lean()

    const slim = products.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      currencySymbol: p.currencySymbol,
      image: p.colors?.[0]?.images?.[0] ?? '',
    }))
    return NextResponse.json(slim)
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
