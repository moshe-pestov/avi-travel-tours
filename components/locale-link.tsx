'use client'

import Link from 'next/link'
import { createContext, useContext, type ComponentProps } from 'react'
import { defaultLocale, isLocale, withLocale, type Locale } from '@/lib/i18n'

const LocaleContext = createContext<Locale>(defaultLocale)

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

/** True for hrefs that should NOT be locale-prefixed (external, anchors, protocols). */
function isExternal(href: string): boolean {
  return (
    /^https?:\/\//.test(href) ||
    href.startsWith('tel:') ||
    href.startsWith('mailto:') ||
    href.startsWith('#')
  )
}

/**
 * Drop-in replacement for next/link that automatically prefixes internal paths
 * with the active locale (e.g. "/contact" -> "/he/contact"). External links,
 * protocols and hashes are passed through untouched.
 */
export function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const locale = useLocale()
  let finalHref = href

  if (typeof href === 'string' && !isExternal(href)) {
    // Support internal hash links like "/#about" -> "/he#about".
    if (href.startsWith('/#')) {
      finalHref = `/${locale}${href.slice(1)}`
    } else if (href.startsWith('/')) {
      const seg = href.split('/')[1]
      finalHref = isLocale(seg) ? href : withLocale(locale, href)
    }
  }

  return <Link href={finalHref} {...props} />
}
