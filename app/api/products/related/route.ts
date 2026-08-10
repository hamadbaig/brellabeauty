import { NextRequest, NextResponse } from 'next/server'
import { getRelatedProducts } from '@/lib/products.server'

export async function GET(req: NextRequest) {
  try {
    const ids = req.nextUrl.searchParams.get('ids')?.split(',') ?? []
    const products = await getRelatedProducts(ids)
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch related products' }, { status: 500 })
  }
}
