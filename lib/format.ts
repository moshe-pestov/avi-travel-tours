import type { Locale } from '@/lib/i18n'

const INTL_LOCALE: Record<Locale, string> = {
  he: 'he-IL',
  ru: 'ru-RU',
}

export function formatDate(iso: string, locale: Locale = 'he'): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat(INTL_LOCALE[locale] ?? 'he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function formatHebrewDate(iso: string): string {
  return formatDate(iso, 'he')
}
