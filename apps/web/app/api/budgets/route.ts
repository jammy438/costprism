import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const CreateBudgetSchema = z.object({
  name: z.string().min(1).max(100),
  scopeType: z.enum(['ORG', 'TEAM', 'SERVICE', 'ACCOUNT', 'ENVIRONMENT']),
  scopeValue: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default('GBP'),
  period: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL']).default('MONTHLY'),
  alertThreshold70: z.boolean().default(true),
  alertThreshold90: z.boolean().default(true),
  alertThreshold100: z.boolean().default(true),
  alertChannels: z.array(z.enum(['EMAIL', 'SLACK'])).default(['EMAIL']),
})

export async function GET() {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const budgets = await prisma.budget.findMany({
    where: { orgId: org.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ budgets })
}

export async function POST(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const body = await req.json()
  const parsed = CreateBudgetSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const budget = await prisma.budget.create({
    data: {
      ...parsed.data,
      orgId: org.id,
    },
  })

  await prisma.auditLog.create({
    data: {
      orgId: org.id,
      action: 'budget.created',
      resourceType: 'budget',
      resourceId: budget.id,
      metadata: { name: budget.name, amount: budget.amount, period: budget.period },
    },
  })

  return NextResponse.json({ budget }, { status: 201 })
}