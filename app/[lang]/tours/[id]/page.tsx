import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowRight, Calendar, Check } from 'lucide-react'
import { LocaleLink } from '@/components/locale-link'
import { SiteLinkButton } from '@/components/site-button'
import { PostGallery } from '@/components/post-gallery'
import { getSpeciality, getSpecialities } from '@/lib/db'
import { getDictionary } from '@/lib/dictionaries'
import { pick, isLocale, defaultLocale, type Locale } from '@/lib/i18n'
import { absoluteUrl, alternatesFor, localePath, ogLocale, siteName } from '@/lib/seo'
import { JsonLd } from '@/components/json-ld'
import type { TouristTrip, BreadcrumbList, WithContext } from 'schema-dts'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}): Promise<Metadata> {
  const { id, lang } = await params
  const locale: Locale = isLocale(lang) ? lang : defaultLocale
  const tour = await getSpeciality(Number(id))
  if (!tour) return { title: locale === 'ru' ? 'Тур не найден' : 'טיול לא נמצא' }
  const title = pick(locale, tour.title, tour.title_ru)
  const description = pick(locale, tour.description, tour.description_ru)
  const path = `/tours/${tour.id}`
  const image = tour.image_url?.startsWith('/') ? absoluteUrl(tour.image_url) : tour.image_url
  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: 'article',
      title,
      description,
      url: absoluteUrl(localePath(locale, path)),
      locale: ogLocale[locale],
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: image ? { card: 'summary_large_image', images: [image] } : undefined,
  }
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}) {
  const { id, lang } = await params
  const locale: Locale = isLocale(lang) ? lang : defaultLocale
  const dict = getDictionary(locale)

  const tour = await getSpeciality(Number(id))
  if (!tour) notFound()

  const others = (await getSpecialities()).filter((t) => t.id !== tour.id).slice(0, 3)

  const title = pick(locale, tour.title, tour.title_ru)
  const description = pick(locale, tour.description, tour.description_ru)
  const bodyText = pick(locale, tour.body || tour.description, tour.body_ru || tour.description_ru)
  const paragraphs = bodyText.split('\n').filter((p) => p.trim().length > 0)

  const tourUrl = absoluteUrl(localePath(locale, `/tours/${tour.id}`))
  const ogImage = tour.image_url?.startsWith('/') ? absoluteUrl(tour.image_url) : tour.image_url

  const tripLd: WithContext<TouristTrip> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: title,
    description,
    image: ogImage || undefined,
    url: tourUrl,
    provider: { '@type': 'TravelAgency', name: siteName[locale], '@id': `${absoluteUrl()}/#organization` },
  }

  const breadcrumbLd: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: siteName[locale], item: absoluteUrl(localePath(locale, '')) },
      { '@type': 'ListItem', position: 2, name: title, item: tourUrl },
    ],
  }

  return (
    <main className="bg-background">
      <JsonLd data={[tripLd, breadcrumbLd]} />
      {/* Hero image */}
      <div className="relative h-[300px] w-full overflow-hidden sm:h-[440px]">
        <img src={tour.image_url || '/placeholder.svg'} alt={title} className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-8">
          <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {dict.tour.recommended}
          </span>
          <h1 className="font-heading text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm text-white/90 sm:text-base">{description}</p>
        </div>
      </div>

      {/* Body */}
      <article className="mx-auto max-w-3xl px-4 py-10">
        <div className="space-y-2 text-[17px] leading-relaxed text-foreground">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-pretty">
              {para}
            </p>
          ))}
        </div>

        {tour.gallery && tour.gallery.length > 0 && (
          <PostGallery images={tour.gallery} title={title} heading={dict.post.gallery} />
        )}

        {/* What's included */}
        <div className="mt-8 rounded-2xl border border-border bg-cream/60 p-6">
          <h2 className="mb-4 font-heading text-lg font-bold text-primary">{dict.tour.included}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {dict.tour.includedItems.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="size-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-primary px-6 py-8 text-center">
          <h2 className="font-heading text-xl font-bold text-primary-foreground text-balance">
            {dict.tour.ctaTitle}
          </h2>
          <p className="max-w-md text-pretty text-sm text-primary-foreground/85">{dict.tour.ctaText}</p>
          <SiteLinkButton href="/contact" variant="white" size="lg" className="w-fit">
            <Calendar className="size-5" />
            {dict.tour.ctaButton}
          </SiteLinkButton>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <LocaleLink
            href="/#tours"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowRight className="size-4" />
            {dict.tour.backAll}
          </LocaleLink>
        </div>
      </article>

      {/* Other tours */}
      {others.length > 0 && (
        <section className="border-t border-border bg-cream/60">
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <h2 className="mb-6 font-heading text-2xl font-bold text-primary">{dict.tour.other}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((t) => {
                const tTitle = pick(locale, t.title, t.title_ru)
                return (
                  <article
                    key={t.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                  >
                    <LocaleLink href={`/tours/${t.id}`} className="aspect-[4/3] overflow-hidden">
                      <img
                        src={t.image_url || '/placeholder.svg'}
                        alt={tTitle}
                        className="size-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </LocaleLink>
                    <div className="flex flex-1 flex-col items-center gap-3 p-5 text-center">
                      <h3 className="font-heading text-lg font-bold leading-snug text-foreground text-balance">
                        <LocaleLink href={`/tours/${t.id}`} className="transition-colors hover:text-primary">
                          {tTitle}
                        </LocaleLink>
                      </h3>
                      <SiteLinkButton href={`/tours/${t.id}`} variant="outline" className="mt-auto">
                        {dict.tour.details}
                      </SiteLinkButton>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
