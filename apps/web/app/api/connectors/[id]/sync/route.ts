import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { internalFetch } from '@/lib/internalApi'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const connector = await prisma.connector.findFirst({
    where: { id, orgId: org.id },
  })
  if (!connector) return NextResponse.json({ error: 'Connector not found' }, { status: 404 })

  // Update status to queued immediately
  await prisma.connector.update({
    where: { id },
    data: { syncStatus: 'QUEUED', syncStartedAt: new Date() },
  })

  // Trigger pipeline
  const res = await internalFetch('/internal/pipeline/trigger', {
    method: 'POST',
    body: JSON.stringify({
      org_id: org.id,
      connector_id: id,
      connector_type: connector.type.toLowerCase(),
    }),
  })

  if (!res.ok) {
    await prisma.connector.update({
      where: { id },
      data: { syncStatus: 'ERROR', lastErrorMessage: 'Failed to trigger sync' },
    })
    return NextResponse.json({ error: 'Failed to trigger sync' }, { status: 500 })
  }

  const data = await res.json()
  return NextResponse.json({ jobId: data.job_id, status: data.status })
}