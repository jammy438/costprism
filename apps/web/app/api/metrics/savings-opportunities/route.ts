import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { internalFetch } from '@/lib/internalApi'

export async function GET(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const from = `${now.getFullYear()}-01-01`
  const to = now.toISOString().split('T')[0]

  const res = await internalFetch(
    `/internal/metrics/savings-opportunities?org_id=${orgId}&from_date=${from}&to_date=${to}`
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch savings opportunities' }, { status: res.status })
  }

  const data = await res.json()

  // Map to component expected shape: { savings: number }
  return NextResponse.json({
    savings: data.total_estimated_saving ?? 0,
    opportunities: data.opportunities ?? [],
  })
}