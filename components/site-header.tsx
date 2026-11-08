'use client'

import { useState } from 'react'
import { Menu, Sparkles, X } from 'lucide-react'
import { Logo } from './logo'
import { SiteLinkButton } from '@/components/site-button'
import { LocaleLink } from '@/components/locale-link'
import { LanguageSwitch } from '@/components/language-switch'
import type { Locale } from '@/lib/i18n'
import type { Dictionary } from '@/lib/dictionaries'

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false)

  const navItems = [
    { label: dict.nav.home, href: '/' },
    { label: dict.nav.about, href: '/#about' },
    { label: dict.nav.dailyTours, href: '/categories/daily-tours' },
    { label: dict.nav.multidayTours, href: '/categories/multiday-tours' },
    { label: dict.nav.romaniaVacations, href: '/categories/romania-vacations' },
    { label: dict.nav.services, href: '/categories/services' },
    { label: dict.nav.deals, href: '/categories/deals' },
    { label: dict.nav.sitesAttractions, href: '/categories/sites-attractions' },
    { label: dict.nav.blog, href: '/blog' },
    { label: dict.nav.contact, href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8 xl:max-w-[88rem]">
        <Logo name={dict.logo.name} tagline={dict.logo.tagline} />

        <nav className="hidden min-w-0 flex-1 flex-nowrap items-center justify-center gap-0 xl:flex">
          {navItems.map((item) => (
            <LocaleLink
              key={item.label}
              href={item.href}
              className="whitespace-nowrap rounded-md px-1.5 py-2 text-xs font-medium text-foreground transition-colors hover:text-primary 2xl:px-2.5 2xl:text-sm"
            >
              {item.label}
            </LocaleLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch current={locale} />
          <SiteLinkButton
            href="/contact"
            variant="orange"
            className="group hidden font-semibold shadow-lg shadow-accent/30 ring-1 ring-inset ring-primary-foreground/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40 sm:inline-flex xl:hidden 2xl:inline-flex"
          >
            <Sparkles className="size-4 transition-transform duration-300 group-hover:rotate-12" />
            {dict.header.planTrip}
          </SiteLinkButton>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-md text-foreground xl:hidden"
            aria-label={dict.header.menu}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-card xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {navItems.map((item) => (
              <LocaleLink
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                {item.label}
              </LocaleLink>
            ))}
            <SiteLinkButton
              href="/contact"
              variant="orange"
              onClick={() => setOpen(false)}
              className="my-2 font-semibold shadow-lg shadow-accent/30"
            >
              <Sparkles className="size-4" />
              {dict.header.planTrip}
            </SiteLinkButton>
          </div>
        </nav>
      )}
    </header>
  )
}
