import { NextResponse } from 'next/server'
import { buildSearchIndex } from '@/lib/content'

// Cached at build time for static deployments
export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  const index = await buildSearchIndex()
  return NextResponse.json(index)
}
