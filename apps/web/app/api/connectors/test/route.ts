import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { internalFetch } from '@/lib/internalApi'

export async function POST(req: Request) {
  const { orgId } = await auth()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const res = await internalFetch('/connectors/test', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Connection test failed' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}