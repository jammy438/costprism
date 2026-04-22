import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

const InviteSchema = z.object({
  invites: z.array(z.object({
    email: z.string().email(),
    role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).default('MEMBER'),
  })).min(1).max(5),
})

// Map our roles to Clerk org roles
const toClerkRole = (role: string) => {
  if (role === 'ADMIN') return 'org:admin'
  return 'org:member'
}

export async function GET() {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const invitations = await prisma.invitation.findMany({
    where: { orgId: org.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ invitations })
}

export async function POST(req: Request) {
  const { orgId, userId } = await auth()
  if (!orgId || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const body = await req.json()
  const parsed = InviteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const client = await clerkClient()
  const results = []
  const errors = []

  for (const invite of parsed.data.invites) {
    try {
      // Send invite via Clerk
      await client.organizations.createOrganizationInvitation({
        organizationId: orgId,
        emailAddress: invite.email,
        role: toClerkRole(invite.role),
        inviterUserId: userId,
      })

      // Store in our DB
      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      const invitation = await prisma.invitation.create({
        data: {
          orgId: org.id,
          email: invite.email,
          role: invite.role as any,
          token,
          expiresAt,
        },
      })

      results.push(invitation)
    } catch (err: any) {
      errors.push({ email: invite.email, error: err?.message ?? 'Failed to send' })
    }
  }

  await prisma.auditLog.create({
    data: {
      orgId: org.id,
      action: 'invitations.sent',
      resourceType: 'invitation',
      metadata: { sent: results.length, failed: errors.length },
    },
  })

  return NextResponse.json({ sent: results, errors }, { status: 201 })
}

export async function DELETE(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organisation.findUnique({ where: { clerkOrgId: orgId } })
  if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const invitationId = searchParams.get('id')
  if (!invitationId) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const invitation = await prisma.invitation.findFirst({
    where: { id: invitationId, orgId: org.id },
  })
  if (!invitation) return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })

  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: 'REVOKED' },
  })

  return NextResponse.json({ ok: true })
}