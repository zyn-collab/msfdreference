import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { password } = await req.json()
  const sitePassword = process.env.SITE_PASSWORD

  if (!sitePassword || password === sitePassword) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('enc_auth', sitePassword || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
    return res
  }

  return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
}
