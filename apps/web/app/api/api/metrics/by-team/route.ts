import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { internalFetch } from '@/lib/internalApi'

export async function GET(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  if (!from || !to) {
    return NextResponse.json({ error: 'Missing from or to params' }, { status: 400 })
  }

  const res = await internalFetch(
    `/internal/metrics/by-team?org_id=${orgId}&from_date=${from}&to_date=${to}`
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch spend by team' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}