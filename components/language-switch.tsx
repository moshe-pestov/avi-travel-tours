'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales, isLocale, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const LABELS: Record<Locale, string> = {
  he: 'עב',
  ru: 'RU',
}

export function LanguageSwitch({ current }: { current: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  function switchTo(locale: Locale) {
    if (locale === current) return
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${60 * 60 * 24 * 365}`

    const segments = pathname.split('/')
    if (isLocale(segments[1])) {
      segments[1] = locale
    } else {
      segments.splice(1, 0, locale)
    }
    router.push(segments.join('/') || `/${locale}`)
    router.refresh()
  }

  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-full border border-border bg-background"
      role="group"
      aria-label="Language switcher"
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-pressed={locale === current}
          className={cn(
            'px-3 py-1 text-xs font-bold transition-colors',
            locale === current
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted',
          )}
        >
          {LABELS[locale]}
        </button>
      ))}
    </div>
  )
}
