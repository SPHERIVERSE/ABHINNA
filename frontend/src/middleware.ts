import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const ADMIN_ROUTE = process.env.NEXT_PUBLIC_ADMIN_ROUTE;
  const path = request.nextUrl.pathname;

  // Security Check: Is this the admin area?
  if (ADMIN_ROUTE && path.startsWith(`/${ADMIN_ROUTE}`)) {
    
    const loginUrl = new URL(`/${ADMIN_ROUTE}/login`, request.url);
    const dashboardUrl = new URL(`/${ADMIN_ROUTE}/dashboard`, request.url);
    const isLoginPage = path === `/${ADMIN_ROUTE}/login`;
    
    // ✅ CRITICAL FIX: Match the backend cookie name "session"
    const authToken = request.cookies.get('session')?.value;

    // 1. User is NOT logged in -> Kick to Login
    if (!authToken && !isLoginPage) {
      return NextResponse.redirect(loginUrl);
    }

    // 2. User IS logged in -> Kick to Dashboard (if they try to visit login)
    if (authToken && isLoginPage) {
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
