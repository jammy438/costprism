import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const CreatePolicySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['BUDGET_GUARDRAIL', 'TAGGING_REQUIRED', 'DRIFT_DETECTION', 'SPEND_ANOMALY']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  config: z.record(z.string(), z.unknown()).transform(val => val as any),
  enabled: z.boolean().default(true),
})

export async function GET() {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const policies = await prisma.governancePolicy.findMany({
    where: { orgId: org.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ policies })
}

export async function POST(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const body = await req.json()
  const parsed = CreatePolicySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const policy = await prisma.governancePolicy.create({
    data: {
      orgId: org.id,
      name: parsed.data.name,
      description: parsed.data.description,
      type: parsed.data.type,
      severity: parsed.data.severity,
      enabled: parsed.data.enabled,
      config: parsed.data.config ?? {},
    },
  })

  await prisma.auditLog.create({
    data: {
      orgId: org.id,
      action: 'governance_policy.created',
      resourceType: 'governance_policy',
      resourceId: policy.id,
      metadata: { name: policy.name, type: policy.type, severity: policy.severity },
    },
  })

  return NextResponse.json({ policy }, { status: 201 })
}