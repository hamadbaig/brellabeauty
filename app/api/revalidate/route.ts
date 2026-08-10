import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  try {
    const { paths } = await req.json()
    if (!Array.isArray(paths)) return NextResponse.json({ error: 'paths must be an array' }, { status: 400 })

    for (const p of paths) {
      revalidatePath(p)
    }

    return NextResponse.json({ revalidated: true, paths })
  } catch {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
