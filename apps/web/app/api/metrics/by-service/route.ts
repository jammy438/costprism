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
    `/internal/metrics/by-service?org_id=${orgId}&from_date=${from}&to_date=${to}`
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch spend by service' }, { status: res.status })
  }

  const data = await res.json()

  // Map George's { rows: [{ service_name, net_amortised_cost, percent_of_total }] }
  // to component expected [{ service, cost, sparklineData }]
  const mapped = (data.rows ?? []).map((r: any) => ({
    service: r.service_name,
    service_name: r.service_name,
    cost: r.net_amortised_cost ?? 0,
    net_amortised_cost: r.net_amortised_cost ?? 0,
    percentage: r.percent_of_total ?? 0,
    sparklineData: [],
  }))

  return NextResponse.json(mapped)
}