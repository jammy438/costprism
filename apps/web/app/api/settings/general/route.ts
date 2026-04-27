import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const UpdateOrgSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  displayCurrency: z.enum(['GBP', 'USD', 'EUR']).optional(),
})

export async function GET() {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  return NextResponse.json({ org })
}

export async function PATCH(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const body = await req.json()
  const parsed = UpdateOrgSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const updated = await prisma.organisation.update({
    where: { id: org.id },
    data: parsed.data,
  })

  await prisma.auditLog.create({
    data: {
      orgId: org.id,
      action: 'org.settings_updated',
      resourceType: 'organisation',
      resourceId: org.id,
      metadata: parsed.data as any,
    },
  })

  return NextResponse.json({ org: updated })
}