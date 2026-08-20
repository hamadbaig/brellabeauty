import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { ProductModel } from '@/models/Product'

function buildQuery(id: string) {
  const conditions: object[] = [{ slug: id }, { id }]
  if (mongoose.Types.ObjectId.isValid(id)) conditions.push({ _id: id })
  return { $or: conditions }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const author = typeof body.author === 'string' ? body.author.trim().slice(0, 80) : ''
    const location = typeof body.location === 'string' ? body.location.trim().slice(0, 80) : ''
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 120) : ''
    const comment = typeof body.comment === 'string' ? body.comment.trim().slice(0, 2000) : ''
    const rating = Number(body.rating)

    if (!author) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    if (!comment) return NextResponse.json({ error: 'Review comment is required' }, { status: 400 })
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    await connectDB()
    const product = await ProductModel.findOne(buildQuery(id))
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const review = {
      id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      author,
      location,
      rating,
      date: new Date().toISOString(),
      title,
      comment,
      verified: false,
      helpful: 0,
    }

    product.reviews.push(review)
    product.totalReviews = product.reviews.length
    product.averageRating =
      product.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / product.reviews.length

    await product.save()
    revalidatePath(`/products/${product.slug}`)

    return NextResponse.json({ review, averageRating: product.averageRating, totalReviews: product.totalReviews }, { status: 201 })
  } catch (err) {
    console.error('[reviews POST]', err)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
