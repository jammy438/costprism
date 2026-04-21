import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orgName, industry, spendRange } = await req.json()
  if (!orgName || !industry || !spendRange) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  // TODO: Store industry and spendRange in audit log as metadata for now
  // TODO:These fields can be added to the organisations table schema in a future migration
  await prisma.auditLog.create({
    data: {
      orgId: org.id,
      action: 'onboarding.profile_updated',
      resourceType: 'organisation',
      resourceId: org.id,
      metadata: { orgName, industry, spendRange },
    },
  })

  return NextResponse.json({ ok: true })
}