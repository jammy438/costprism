import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({
    where: { clerkOrgId: orgId },
    include: { subscription: true },
  })

  if (!org || !org.subscription) {
    return NextResponse.json({
      status: 'TRIALING',
      tier: 'FREE',
      trialEndsAt: null,
      currentPeriodEnd: null,
      daysRemaining: null,
    })
  }

  const sub = org.subscription
  const daysRemaining = sub.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(sub.trialEndsAt).getTime() - Date.now()) / 86400000))
    : null

  return NextResponse.json({
    status: sub.status,
    tier: sub.tier,
    trialEndsAt: sub.trialEndsAt?.toISOString() ?? null,
    currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
    daysRemaining,
  })
}