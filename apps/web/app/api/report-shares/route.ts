import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'

const CreateShareSchema = z.object({
  reportType: z.string().min(1),
  expiresInDays: z.number().optional(),
  password: z.string().optional(),
})

export async function GET() {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const shares = await prisma.reportShare.findMany({
    where: { orgId: org.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ shares })
}

export async function POST(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const body = await req.json()
  const parsed = CreateShareSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const token = randomBytes(32).toString('hex')
  const expiresAt = parsed.data.expiresInDays
    ? new Date(Date.now() + parsed.data.expiresInDays * 24 * 60 * 60 * 1000)
    : null

  const passwordHash = parsed.data.password
    ? await bcrypt.hash(parsed.data.password, 10)
    : null

  const share = await prisma.reportShare.create({
    data: {
      orgId: org.id,
      reportType: parsed.data.reportType,
      token,
      expiresAt,
      passwordHash,
    },
  })

  return NextResponse.json({ share, url: `${process.env.NEXT_PUBLIC_APP_URL}/r/${token}` }, { status: 201 })
}