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
    `/internal/metrics/summary?org_id=${orgId}&from_date=${from}&to_date=${to}`
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: res.status })
  }

  const data = await res.json()

  // Map George's response to component expected shape
  return NextResponse.json({
    currentSpend: data.mtd_spend ?? data.total_spend ?? 0,
    previousSpend: data.prior_month_spend ?? 0,
  })
}