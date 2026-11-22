import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

// Public API access: everything else under /api requires an admin session.
function isPublicApi(method: string, path: string) {
  if (path === '/api/auth/login' || path === '/api/auth/logout') return true;
  if (method === 'GET' && /^\/api\/(products|categories|hero|reviews)(\/[^/]+)?$/.test(path)) return true;
  if (method === 'POST' && (path === '/api/reviews' || path === '/api/contact')) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/');

  if (isApi && isPublicApi(request.method, pathname)) return NextResponse.next();

  const authed = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (authed) return NextResponse.next();

  if (isApi) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
