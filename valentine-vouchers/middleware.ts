import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/auth-edge'; // Use Edge-compatible version

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public paths
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Admin-only registration path
  if (pathname === '/register') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const verified = verifyTokenEdge(token);
    if (!verified || !verified.isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const verified = verifyTokenEdge(token);
  if (!verified) {
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/admin/:path*', '/vouchers/:path*']
};