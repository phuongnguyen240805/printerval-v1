// Ví dụ nội dung trong src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken') // Hoặc authToken

  // Nếu vào trang account mà không có token -> Redirect về login
  if (request.nextUrl.pathname.startsWith('/account') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*'],
}