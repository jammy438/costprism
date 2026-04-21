import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { internalFetch } from '@/lib/internalApi'

export async function GET(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const source = searchParams.get('source')
  const page = searchParams.get('page') ?? '1'
  const pageSize = searchParams.get('pageSize') ?? '100'

  if (!from || !to) {
    return NextResponse.json({ error: 'Missing from or to params' }, { status: 400 })
  }

  const params = new URLSearchParams({
    org_id: orgId,
    from_date: from,
    to_date: to,
    page,
    page_size: pageSize,
  })
  if (source) params.set('source', source)

  const res = await internalFetch(`/costs?${params.toString()}`)

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch costs' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}