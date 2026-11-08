import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LocaleProvider } from '@/components/locale-link'
import { getDictionary } from '@/lib/dictionaries'
import { locales, isLocale, type Locale } from '@/lib/i18n'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = getDictionary(locale)

  return (
    <LocaleProvider locale={locale}>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader locale={locale} dict={dict} />
        <div className="flex-1">{children}</div>
        <SiteFooter locale={locale} dict={dict} />
      </div>
    </LocaleProvider>
  )
}
