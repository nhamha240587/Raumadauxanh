import { NextRequest, NextResponse } from 'next/server'
import { initDb, getLeadByRef } from '@/lib/db'

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')
  if (!ref) return NextResponse.json({ ok: false }, { status: 400 })

  await initDb()
  const lead = await getLeadByRef(ref)
  if (!lead || lead.payment_status !== 'paid') {
    return NextResponse.json({ ok: false }, { status: 403 })
  }

  return NextResponse.json({
    ok: true,
    groupLink: process.env.COURSE_GROUP_LINK || null,
  })
}
