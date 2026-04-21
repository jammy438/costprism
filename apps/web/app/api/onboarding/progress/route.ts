import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const progress = await prisma.onboardingProgress.findMany({
    where: { orgId: org.id },
    orderBy: { step: 'asc' },
  })

  return NextResponse.json({ completedSteps: progress.map((p) => p.step) })
}

export async function POST(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { step } = await req.json()
  if (!step || typeof step !== 'number') {
    return NextResponse.json({ error: 'Invalid step' }, { status: 400 })
  }

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  await prisma.onboardingProgress.upsert({
    where: { orgId_step: { orgId: org.id, step } },
    update: { completedAt: new Date() },
    create: { orgId: org.id, step, completedAt: new Date() },
  })

  return NextResponse.json({ ok: true })
}