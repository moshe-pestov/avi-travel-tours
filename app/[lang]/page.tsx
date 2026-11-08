import { HeroSection } from '@/components/home/hero-section'
import { SpecialitiesSection } from '@/components/home/specialities-section'
import { ToursSection } from '@/components/home/tours-section'
import { MultiDaySection } from '@/components/home/multiday-section'
import { PromoBanner } from '@/components/home/promo-banner'
import { BlogPreview } from '@/components/home/blog-preview'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CtaSection } from '@/components/home/cta-section'
import type { Metadata } from 'next'
import { getPosts, getSettings, getTestimonials, getSpecialities } from '@/lib/db'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale, defaultLocale, type Locale } from '@/lib/i18n'
import {
  absoluteUrl,
  alternatesFor,
  localePath,
  ogLocale,
  siteName,
  siteDescription,
} from '@/lib/seo'
import { JsonLd } from '@/components/json-ld'
import type { TravelAgency, WebSite, WithContext } from 'schema-dts'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale: Locale = isLocale(lang) ? lang : defaultLocale
  return {
    title: { absolute: siteName[locale] },
    description: siteDescription[locale],
    alternates: alternatesFor(locale, ''),
    openGraph: {
      title: siteName[locale],
      description: siteDescription[locale],
      url: absoluteUrl(localePath(locale, '')),
      locale: ogLocale[locale],
    },
  }
}

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = getDictionary(lang)

  const [vacationPosts, servicePosts, settings, testimonials, specialities] = await Promise.all([
    getPosts('חופשות ברומניה'),
    getPosts('השירותים שלנו'),
    getSettings(),
    getTestimonials(),
    getSpecialities(),
  ])

  const phone = settings.phone || '0040-760-610-995'
  const homeUrl = absoluteUrl(localePath(lang, ''))

  // Locale-aware defaults: when the admin hasn't filled the Russian text yet,
  // fall back to a Russian default (not the Hebrew one) so the RU page never
  // mixes languages. A saved DB value always takes precedence.
  const heroTitle =
    lang === 'ru'
      ? settings.hero_title_ru?.trim() || 'Настоящая Румыния начинается здесь'
      : settings.hero_title?.trim() || 'רומניה האמיתית מתחילה כאן'
  const heroSubtitle =
    lang === 'ru'
      ? settings.hero_subtitle_ru?.trim() ||
        'Индивидуальные туры, отдых и незабываемые впечатления — с личным сопровождением'
      : settings.hero_subtitle?.trim() ||
        'טיולים פרטיים, חופשות וחוויות בלתי נשכחות — עם שירות וליווי בעברית'
  const bannerText =
    lang === 'ru'
      ? settings.banner_text_ru?.trim() || 'Проживание в Карпатах + аренда авто + личный маршрут'
      : settings.banner_text?.trim() || 'לינה בקרפטים + רכב שכור + מסלול אישי'
  const bannerBadge =
    lang === 'ru'
      ? settings.banner_badge_ru?.trim() || 'Специальное предложение'
      : settings.banner_badge?.trim() || 'מבצע מיוחד'
  const specialitiesHeading =
    lang === 'ru'
      ? settings.specialities_heading_ru?.trim() || dict.specialities.heading
      : settings.specialities_heading?.trim() || dict.specialities.heading

  const travelAgencyLd: WithContext<TravelAgency> = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${absoluteUrl()}/#organization`,
    name: siteName[lang],
    description: siteDescription[lang],
    url: homeUrl,
    image: absoluteUrl('/images/og-cover.png'),
    logo: absoluteUrl('/icon.png'),
    telephone: phone,
    areaServed: 'Romania',
    knowsLanguage: ['he', 'ru'],
  }

  const webSiteLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absoluteUrl()}/#website`,
    name: siteName[lang],
    url: homeUrl,
    inLanguage: lang,
    publisher: { '@id': `${absoluteUrl()}/#organization` },
  }

  return (
    <main>
      <JsonLd data={[travelAgencyLd, webSiteLd]} />
      <HeroSection title={heroTitle} subtitle={heroSubtitle} dict={dict} />
      <PromoBanner text={bannerText} badge={bannerBadge} />
      <SpecialitiesSection specialities={specialities} locale={lang} dict={dict} heading={specialitiesHeading} />
      <ToursSection posts={vacationPosts} locale={lang} dict={dict} />
      <MultiDaySection dict={dict} />
      <BlogPreview posts={servicePosts} locale={lang} dict={dict} />
      <TestimonialsSection testimonials={testimonials} locale={lang} dict={dict} />
      <CtaSection whatsapp={settings.whatsapp ?? '0040760610995'} dict={dict} />
    </main>
  )
}
