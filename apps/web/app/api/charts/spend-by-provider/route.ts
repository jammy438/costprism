import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { internalFetch } from '@/lib/internalApi'

export async function GET(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from') ?? `${new Date().getFullYear()}-01-01`
  const to = searchParams.get('to') ?? new Date().toISOString().split('T')[0]
  const res = await internalFetch(`/internal/metrics/by-provider?org_id=${orgId}&from_date=${from}&to_date=${to}`)
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch provider spend' }, { status: res.status })
  const data = await res.json()
  const mapped = (data.rows ?? []).map((r: any) => ({ provider: r.provider, cost: r.net_amortised_cost ?? 0, sparklineData: [] }))
  return NextResponse.json(mapped)
}