import { NextResponse } from 'next/server'

export function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admin/authenticate') {
    return NextResponse.next();
  }
  if (request.cookies.has("adminAuth")) return NextResponse.next()
  return NextResponse.redirect(new URL('/admin/authenticate', request.url))
}

export const config = {
  matcher: '/admin/:path*',
}