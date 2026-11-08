import { locales, defaultLocale, type Locale } from '@/lib/i18n'

/** Production domain of the site. */
const PRODUCTION_URL = 'https://avi-travel-tours.com'

/**
 * Canonical absolute base URL of the site.
 * Priority: explicit NEXT_PUBLIC_SITE_URL → production domain.
 * Falls back to localhost only during local development (no domain configured).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'production' ? PRODUCTION_URL : 'http://localhost:3000')
).replace(/\/+$/, '')

/** Localized site name (brand) per locale. */
export const siteName: Record<Locale, string> = {
  he: 'אבי טיולים ותיירות ברומניה',
  ru: 'Ави Туры — туризм в Румынии',
}

/** Localized default site description. */
export const siteDescription: Record<Locale, string> = {
  he: 'טיולים פרטיים, חופשות וחוויות בלתי נשכחות ברומניה — עם שירות אישי וליווי בעברית. מעל 15 שנות ניסיון.',
  ru: 'Индивидуальные туры, отдых и незабываемые впечатления в Румынии — с личным сервисом и сопровождением. Более 15 лет опыта.',
}

/** Localized keyword sets used for the `keywords` meta tag. */
export const siteKeywords: Record<Locale, string[]> = {
  he: ['טיולים ברומניה', 'תיירות ברומניה', 'טיול מאורגן רומניה', 'טרנסילבניה', 'חופשה ברומניה', 'מדריך דובר עברית'],
  ru: ['туры по Румынии', 'отдых в Румынии', 'путешествие Румыния', 'Трансильвания', 'экскурсии Румыния', 'гид Румыния'],
}

/** Open Graph locale codes. */
export const ogLocale: Record<Locale, string> = {
  he: 'he_IL',
  ru: 'ru_RU',
}

/** Prefix a locale-agnostic path with a locale segment (e.g. "/he/contact"). */
export function localePath(locale: Locale, path = ''): string {
  const clean = path && !path.startsWith('/') ? `/${path}` : path
  return `/${locale}${clean}`
}

/** Build an absolute URL from an internal path. */
export function absoluteUrl(path = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${clean === '/' ? '' : clean}`
}

/**
 * Build `alternates` (canonical + hreflang languages) for a locale-agnostic
 * path. Pass '' for the home page, '/contact', '/posts/3', etc.
 */
export function alternatesFor(locale: Locale, path = '') {
  const languages: Record<string, string> = {}
  for (const l of locales) {
    languages[l] = absoluteUrl(localePath(l, path))
  }
  languages['x-default'] = absoluteUrl(localePath(defaultLocale, path))
  return {
    canonical: absoluteUrl(localePath(locale, path)),
    languages,
  }
}
