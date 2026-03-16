import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE = 'enc_auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page and static assets
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // If no password is configured, allow all access
  const sitePassword = process.env.SITE_PASSWORD
  if (!sitePassword) return NextResponse.next()

  const authCookie = request.cookies.get(AUTH_COOKIE)
  if (authCookie?.value === sitePassword) return NextResponse.next()

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
