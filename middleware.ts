import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, isLocale } from '@/lib/i18n'

const PUBLIC_FILE = /\.[^/]+$/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip admin, Next internals, API, and static assets.
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.png' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const firstSegment = pathname.split('/')[1]

  // Already has a locale prefix → forward with x-locale header + refresh cookie.
  if (isLocale(firstSegment)) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', firstSegment)
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    response.cookies.set('NEXT_LOCALE', firstSegment, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
    return response
  }

  // No locale prefix → redirect to the cookie locale or the default.
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|api|admin|images|favicon.ico|icon.png|robots.txt|sitemap.xml).*)'],
}
