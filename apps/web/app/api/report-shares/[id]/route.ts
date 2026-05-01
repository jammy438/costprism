import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const share = await prisma.reportShare.findFirst({
    where: { id, orgId: org.id },
  })
  if (!share) return NextResponse.json({ error: 'Share not found' }, { status: 404 })

  await prisma.reportShare.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}