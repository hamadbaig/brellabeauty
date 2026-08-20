import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import { HomepageContentModel } from '@/models/HomepageContent'
import { getAdminUser } from '@/lib/auth.server'
import { getHomepageContent, withHomepageDefaults } from '@/lib/homepage.server'

export const revalidate = 0

export async function GET() {
  try {
    const content = await getHomepageContent()
    return NextResponse.json(content, { headers: { 'Cache-Control': 'no-store, must-revalidate' } })
  } catch (e) {
    console.error('[homepage GET]', e)
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAdminUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const body = await req.json()
    // Never let the client overwrite these — they're managed by the DB/collection identity.
    const { _id, __v, createdAt, updatedAt, collection: _collection, ...safeBody } = body

    const content = await HomepageContentModel.findOneAndUpdate(
      { collection: 'Brella Beauty' },
      { $set: safeBody },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    ).lean()

    revalidatePath('/')
    return NextResponse.json(withHomepageDefaults(content as Record<string, any>), {
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    })
  } catch (e) {
    console.error('[homepage PUT]', e)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
