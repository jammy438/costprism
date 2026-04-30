import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { internalFetch } from '@/lib/internalApi'

export async function GET() {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const res = await internalFetch(`/internal/tags/discovered?org_id=${orgId}`)

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch discovered tags' }, { status: res.status })
  }

  return NextResponse.json(await res.json())
}