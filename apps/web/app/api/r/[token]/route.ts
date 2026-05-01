import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const share = await prisma.reportShare.findUnique({
    where: { token },
    include: { org: { select: { name: true, displayCurrency: true } } },
  })

  if (!share) return NextResponse.json({ error: 'Report not found' }, { status: 404 })

  if (share.expiresAt && share.expiresAt < new Date()) {
    return NextResponse.json({ error: 'This report link has expired' }, { status: 410 })
  }

  // Increment view count
  await prisma.reportShare.update({
    where: { token },
    data: { viewCount: { increment: 1 } },
  })

  return NextResponse.json({
    reportType: share.reportType,
    orgName: share.org.name,
    currency: share.org.displayCurrency,
    hasPassword: !!share.passwordHash,
    createdAt: share.createdAt,
    expiresAt: share.expiresAt,
  })
}