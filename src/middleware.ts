import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // 1. Canonical Host Check (Section 7.1)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (
    siteUrl &&
    !host.includes('localhost') &&
    !host.includes('127.0.0.1') &&
    !host.endsWith('.vercel.app')
  ) {
    try {
      const canonicalHost = new URL(siteUrl).host;
      if (host !== canonicalHost) {
        const canonicalUrl = new URL(request.url);
        canonicalUrl.host = canonicalHost;
        canonicalUrl.protocol = 'https:';
        return NextResponse.redirect(canonicalUrl.toString(), 308);
      }
    } catch {
      // Invalid URL in env - skip
    }
  }

  // 2. Lowercase Paths (outside /api, /_next, and static files)
  if (
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    /[A-Z]/.test(pathname)
  ) {
    const lowerUrl = new URL(request.url);
    lowerUrl.pathname = pathname.toLowerCase();
    return NextResponse.redirect(lowerUrl.toString(), 308);
  }

  // 3. Robots Header Definition (Section 7.1)
  const isNoIndex =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname === '/thank-you' ||
    pathname === '/book-consultation/confirmed';

  // 4. Fast path: Public routes do NOT need Supabase session check!
  // This eliminates edge latency on all public pages, redirects, and marketing traffic.
  if (!pathname.startsWith('/admin')) {
    const response = NextResponse.next({ request });
    if (isNoIndex) {
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }
    return response;
  }

  // 5. Admin Auth Guards (Section 7.7) - only executed for /admin/*
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const isLoginPage = pathname === '/admin/login';

  if (!user || !supabase) {
    if (!isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  } else {
    // User is authenticated in Supabase Auth. Verify presence in admin_users table
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!adminUser) {
      // Authenticated user not present in admin_users: sign out and redirect with error
      await supabase.auth.signOut();
      const unauthUrl = new URL('/admin/login', request.url);
      unauthUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(unauthUrl);
    }

    // Valid admin visiting login page: redirect to dashboard
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  if (isNoIndex) {
    supabaseResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions: png, jpg, jpeg, svg, gif, webp, ico, xml, txt
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt)$).*)',
  ],
};
