import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHmac, timingSafeEqual } from 'crypto'

// George calls this endpoint from PublishPipelineEventActivity
// Payload schema agreed with George

export async function POST(req: Request) {
  // Verify shared secret — George includes this header on every call
  const secret = process.env.PIPELINE_WEBHOOK_SECRET
  if (secret) {
    const signature = req.headers.get('x-pipeline-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }
    const body = await req.text()
    const expected = 'sha256=' + createHmac('sha256', secret).update(body).digest('hex')
    try {
      if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    // Re-parse body after reading as text
    var payload = JSON.parse(body)
  } else {
    var payload = await req.json()
  }

  const {
    org_id,        // CostPrism org UUID
    connector_id,  // connector UUID
    status,        // 'complete' | 'error'
    row_count,     // number of rows synced (on success)
    error_message, // error string (on failure)
    job_id,        // Temporal workflow ID
  } = payload

  if (!org_id || !connector_id || !status) {
    return NextResponse.json({ error: 'Missing required fields: org_id, connector_id, status' }, { status: 400 })
  }

  if (!['complete', 'error'].includes(status)) {
    return NextResponse.json({ error: 'status must be complete or error' }, { status: 400 })
  }

  // Verify connector belongs to org
  const connector = await prisma.connector.findFirst({
    where: { id: connector_id, org: { id: org_id } },
    include: { org: true },
  })

  if (!connector) {
    return NextResponse.json({ error: 'Connector not found' }, { status: 404 })
  }

  // Update connector sync state
  await prisma.connector.update({
    where: { id: connector_id },
    data: {
      syncStatus: status === 'complete' ? 'COMPLETE' : 'ERROR',
      lastSyncedAt: new Date(),
      lastSyncRowCount: row_count ?? null,
      lastErrorMessage: error_message ?? null,
      syncCompletedAt: new Date(),
    },
  })

  // Create in-app notification
  const isSuccess = status === 'complete'
  await prisma.notification.create({
    data: {
      orgId: connector.org.id,
      type: isSuccess ? 'SYNC_COMPLETE' : 'SYNC_FAILED',
      title: isSuccess
        ? `${connector.name} sync complete`
        : `${connector.name} sync failed`,
      body: isSuccess
        ? `${row_count?.toLocaleString() ?? 0} cost rows synced successfully.`
        : `Sync failed: ${error_message ?? 'Unknown error'}. Check your connector settings.`,
      linkUrl: `/dashboard/connectors`,
    },
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      orgId: connector.org.id,
      action: isSuccess ? 'pipeline.sync_complete' : 'pipeline.sync_failed',
      resourceType: 'connector',
      resourceId: connector_id,
      metadata: { job_id, row_count, error_message },
    },
  })

  return NextResponse.json({ ok: true })
}