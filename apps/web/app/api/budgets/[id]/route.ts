import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const UpdateBudgetSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  scopeType: z.enum(['ORG', 'TEAM', 'SERVICE', 'ACCOUNT', 'ENVIRONMENT']).optional(),
  scopeValue: z.string().optional(),
  amount: z.number().positive().optional(),
  currency: z.string().optional(),
  period: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL']).optional(),
  alertThreshold70: z.boolean().optional(),
  alertThreshold90: z.boolean().optional(),
  alertThreshold100: z.boolean().optional(),
  alertChannels: z.array(z.enum(['EMAIL', 'SLACK'])).optional(),
})

async function getOrgAndBudget(orgId: string, budgetId: string) {
  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return { error: 'Org not found', status: 404 }

  const budget = await prisma.budget.findFirst({
    where: { id: budgetId, orgId: org.id },
  })
  if (!budget) return { error: 'Budget not found', status: 404 }

  return { org, budget }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const result = await getOrgAndBudget(orgId, id)
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  return NextResponse.json({ budget: result.budget })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const result = await getOrgAndBudget(orgId, id)
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  const body = await req.json()
  const parsed = UpdateBudgetSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const updated = await prisma.budget.update({
    where: { id },
    data: parsed.data,
  })

  await prisma.auditLog.create({
    data: {
      orgId: result.org.id,
      action: 'budget.updated',
      resourceType: 'budget',
      resourceId: id,
      metadata: parsed.data,
    },
  })

  return NextResponse.json({ budget: updated })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const result = await getOrgAndBudget(orgId, id)
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status })

  await prisma.budget.delete({ where: { id } })

  await prisma.auditLog.create({
    data: {
      orgId: result.org.id,
      action: 'budget.deleted',
      resourceType: 'budget',
      resourceId: id,
    },
  })

  return NextResponse.json({ ok: true })
}