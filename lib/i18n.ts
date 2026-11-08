export const locales = ['he', 'ru'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'he'

/**
 * Hebrew names for each locale, used to label the admin language tabs.
 * When adding a new language, add it to `locales` above and to this map.
 */
export const localeAdminLabels: Record<Locale, string> = {
  he: 'עברית',
  ru: 'רוסית',
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

export function dir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'he' ? 'rtl' : 'ltr'
}

/**
 * Pick the value for the given locale, falling back to the Hebrew (canonical)
 * value when the Russian translation is missing/empty.
 */
export function pick(locale: Locale, he: string | null | undefined, ru?: string | null): string {
  if (locale === 'ru') {
    const trimmed = (ru ?? '').trim()
    if (trimmed.length > 0) return ru as string
  }
  return he ?? ''
}

/** Prefix an internal path with the active locale (e.g. "/he/contact"). */
export function withLocale(locale: Locale, path: string): string {
  if (!path.startsWith('/')) path = `/${path}`
  // Preserve hash-only or already-prefixed links.
  if (path === '/') return `/${locale}`
  const seg = path.split('/')[1]
  if (isLocale(seg)) return path
  return `/${locale}${path}`
}
