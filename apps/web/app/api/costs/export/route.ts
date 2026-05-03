import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { internalFetch } from '@/lib/internalApi'

export async function GET(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from') ?? `${new Date().getFullYear()}-01-01`
  const to = searchParams.get('to') ?? new Date().toISOString().split('T')[0]

  const res = await internalFetch(
    `/internal/costs?org_id=${orgId}&from_date=${from}&to_date=${to}&page=1&page_size=10000`
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch cost data' }, { status: res.status })
  }

  const data = await res.json()
  const rows = data.rows ?? []

  // Build CSV
  const headers = [
    'charge_period_start', 'charge_period_end', 'provider', 'service_name',
    'region_name', 'charge_type', 'net_amortised_cost', 'display_currency',
    'display_amount', 'resource_id', 'resource_name', 'environment', 'team',
  ]

  const csvLines = [
    headers.join(','),
    ...rows.map((row: any) => [
      row.charge_period_start,
      row.charge_period_end,
      row.provider,
      row.service_name,
      row.region_name,
      row.charge_type,
      row.net_amortised_cost,
      row.display_currency,
      row.display_amount,
      row.resource_id ?? '',
      row.resource_name ?? '',
      row.normalised_tags?.environment ?? '',
      row.normalised_tags?.team ?? '',
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')),
  ]

  const csv = csvLines.join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="costprism-costs-${from}-${to}.csv"`,
    },
  })
}