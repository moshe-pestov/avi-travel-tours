import type { Metadata } from 'next'
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { SectionHeading } from '@/components/section-heading'
import { getSettings } from '@/lib/db'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale, defaultLocale, type Locale } from '@/lib/i18n'
import { absoluteUrl, alternatesFor, localePath, ogLocale } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale: Locale = isLocale(lang) ? lang : defaultLocale
  const dict = getDictionary(locale)
  return {
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
    alternates: alternatesFor(locale, '/contact'),
    openGraph: {
      title: dict.contact.metaTitle,
      description: dict.contact.metaDescription,
      url: absoluteUrl(localePath(locale, '/contact')),
      locale: ogLocale[locale],
    },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale: Locale = isLocale(lang) ? lang : defaultLocale
  const dict = getDictionary(locale)

  const settings = await getSettings()
  const phone = settings.phone || '0040-760-610-995'
  const whatsapp = settings.whatsapp || '0040760610995'

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8">
        <SectionHeading className="mb-4">{dict.contact.title}</SectionHeading>
        <p className="mx-auto mb-10 max-w-2xl text-center leading-relaxed text-muted-foreground text-pretty">
          {dict.contact.subtitle}
        </p>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact info */}
          <aside className="lg:col-span-2">
            <div className="flex h-full flex-col gap-5 rounded-2xl bg-primary p-8 text-primary-foreground">
              <h2 className="font-heading text-xl font-bold">{dict.contact.infoHeading}</h2>
              <ContactItem icon={Phone} label={dict.contact.phone}>
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:underline" dir="ltr">
                  {phone}
                </a>
              </ContactItem>
              <ContactItem icon={MessageCircle} label={dict.contact.whatsapp}>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  dir="ltr"
                >
                  {phone}
                </a>
              </ContactItem>
              <ContactItem icon={Mail} label={dict.contact.email}>
                <a href="mailto:avi@avi-travel-tours.com" className="hover:underline" dir="ltr">
                  avi@avi-travel-tours.com
                </a>
              </ContactItem>
              <ContactItem icon={MapPin} label={dict.contact.availability}>
                {dict.contact.availabilityValue}
              </ContactItem>

              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-background px-6 text-base font-medium text-primary transition-colors hover:bg-cream"
              >
                <MessageCircle className="size-5" />
                {dict.contact.whatsappCta}
              </a>
            </div>
          </aside>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm lg:col-span-3">
            <ContactForm locale={locale} labels={dict.contact.form} />
          </div>
        </div>
      </div>
    </main>
  )
}

function ContactItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Phone
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
        <Icon className="size-5 text-accent" />
      </span>
      <div className="flex flex-col">
        <span className="text-sm text-primary-foreground/70">{label}</span>
        <span className="font-medium">{children}</span>
      </div>
    </div>
  )
}
