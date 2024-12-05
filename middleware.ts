import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const adminCookie = request.cookies.get('admin')

  const isRootRoute = request.nextUrl.pathname === '/'
  const isAppRoute = request.nextUrl.pathname.startsWith('/app')
  const isLoginPage = request.nextUrl.pathname === '/login'

  if (isAppRoute && !adminCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginPage && adminCookie) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  if (isRootRoute && !adminCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isRootRoute && adminCookie) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  return NextResponse.next()
}

// Specify which routes to run the middleware on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ]
}
