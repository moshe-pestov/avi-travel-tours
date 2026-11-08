import Link from 'next/link'
import { Phone, MessageCircle } from 'lucide-react'
import { Logo } from './logo'
import { LocaleLink } from '@/components/locale-link'
import { getSettings } from '@/lib/db'
import type { Locale } from '@/lib/i18n'
import type { Dictionary } from '@/lib/dictionaries'

export async function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const settings = await getSettings()
  const phone = settings.phone ?? '0040-760-610-995'
  const whatsapp = settings.whatsapp ?? '0040760610995'

  const navLinks = [
    { label: dict.nav.home, href: '/' },
    { label: dict.nav.dailyTours, href: '/categories/daily-tours' },
    { label: dict.nav.multidayTours, href: '/categories/multiday-tours' },
    { label: dict.nav.deals, href: '/categories/deals' },
    { label: dict.nav.contact, href: '/contact' },
  ]

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row lg:px-8">
        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary-foreground/20"
          >
            <MessageCircle className="size-4" />
            {phone}
          </a>
          <a href={`tel:${phone}`} className="hidden items-center gap-2 text-sm sm:flex">
            <Phone className="size-4" />
            {dict.footer.callUs}
          </a>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {navLinks.map((item) => (
            <LocaleLink key={item.label} href={item.href} className="hover:text-accent">
              {item.label}
            </LocaleLink>
          ))}
          {/* Admin lives outside the localized routes, so it must not be prefixed. */}
          <Link href="/admin" className="hover:text-accent">
            {dict.footer.admin}
          </Link>
        </nav>

        <Logo variant="light" name={dict.logo.name} tagline={dict.logo.tagline} />
      </div>
      <div className="border-t border-primary-foreground/15">
        <p className="mx-auto max-w-7xl px-4 py-3 text-center text-xs text-primary-foreground/70 lg:px-8">
          © {new Date().getFullYear()} {dict.logo.name} {dict.logo.tagline} — {dict.footer.rights}
        </p>
      </div>
    </footer>
  )
}
