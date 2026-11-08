'use client'

import { useState, type ReactNode } from 'react'
import { locales, localeAdminLabels, defaultLocale, type Locale } from '@/lib/i18n'

/**
 * Language tabs for admin editors. Renders one panel per configured locale and
 * keeps every panel mounted (inactive ones use the `hidden` attribute) so that
 * all language fields are submitted with the surrounding form.
 *
 * Adding a new language only requires updating `locales` and `localeAdminLabels`
 * in `lib/i18n.ts` — the tabs update automatically.
 */
export function LangTabs({ children }: { children: (locale: Locale) => ReactNode }) {
  const [active, setActive] = useState<Locale>(defaultLocale)

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" aria-label="שפת התוכן" className="flex gap-1 rounded-lg bg-muted p-1">
        {locales.map((locale) => {
          const isActive = locale === active
          return (
            <button
              key={locale}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(locale)}
              className={
                isActive
                  ? 'flex-1 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors'
                  : 'flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
              }
            >
              {localeAdminLabels[locale]}
            </button>
          )
        })}
      </div>

      {locales.map((locale) => (
        <div key={locale} role="tabpanel" hidden={locale !== active} className="flex flex-col gap-3">
          {children(locale)}
        </div>
      ))}
    </div>
  )
}
