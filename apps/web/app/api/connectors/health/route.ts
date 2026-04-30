import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { internalFetch } from '@/lib/internalApi'

export async function GET(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const res = await internalFetch(`/internal/connectors/health?org_id=${orgId}`)
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch health' }, { status: res.status })
  const data = await res.json()
  return NextResponse.json({ successRate: data.overall_success_rate ?? 0, jobs: data.total_jobs_7d ?? 0, connectors: data.connectors ?? [] })
}