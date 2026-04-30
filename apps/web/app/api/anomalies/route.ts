import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { internalFetch } from '@/lib/internalApi'

export async function GET(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = searchParams.get('limit') ?? '10'

  const now = new Date()
  const from = `${now.getFullYear()}-01-01`
  const to = now.toISOString().split('T')[0]

  const res = await internalFetch(
    `/internal/anomalies?org_id=${orgId}&from_date=${from}&to_date=${to}&limit=${limit}`
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch anomalies' }, { status: res.status })
  }

  const data = await res.json()

  // Map to component expected shape: [{ id, title, description, severity, lastSynced }]
  const mapped = (data.anomalies ?? []).map((a: any) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    severity: a.severity,
    lastSynced: a.detected_at,
  }))

  return NextResponse.json(mapped)
}