import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const UpdatePolicySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  type: z.enum(['BUDGET_GUARDRAIL', 'TAGGING_REQUIRED', 'DRIFT_DETECTION', 'SPEND_ANOMALY']).optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  config: z.record(z.string(), z.unknown()).transform(val => val as any).optional(),
  enabled: z.boolean().optional(),
})

async function getOrgAndPolicy(orgId: string, policyId: string) {
  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return { error: 'Org not found', status: 404 }

  const policy = await prisma.governancePolicy.findFirst({
    where: { id: policyId, orgId: org.id },
  })
  if (!policy) return { error: 'Policy not found', status: 404 }

  return { org, policy }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const result = await getOrgAndPolicy(orgId, id)
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  return NextResponse.json({ policy: result.policy })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const result = await getOrgAndPolicy(orgId, id)
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  const body = await req.json()
  const parsed = UpdatePolicySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const updated = await prisma.governancePolicy.update({
    where: { id },
    data: parsed.data,
  })

  await prisma.auditLog.create({
    data: {
      orgId: result.org.id,
      action: 'governance_policy.updated',
      resourceType: 'governance_policy',
      resourceId: id,
      metadata: parsed.data as any,
    },
  })

  return NextResponse.json({ policy: updated })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const result = await getOrgAndPolicy(orgId, id)
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  await prisma.governancePolicy.delete({ where: { id } })

  await prisma.auditLog.create({
    data: {
      orgId: result.org.id,
      action: 'governance_policy.deleted',
      resourceType: 'governance_policy',
      resourceId: id,
    },
  })

  return NextResponse.json({ ok: true })
}