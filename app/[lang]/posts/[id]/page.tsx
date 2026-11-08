import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { LocaleLink } from '@/components/locale-link'
import { PostCard } from '@/components/post-card'
import { PostGallery } from '@/components/post-gallery'
import { formatDate } from '@/lib/format'
import { getSlugByCategory, localizedCategoryTitle } from '@/lib/categories'
import { getPost, getPosts } from '@/lib/db'
import { getDictionary } from '@/lib/dictionaries'
import { pick, isLocale, defaultLocale, type Locale } from '@/lib/i18n'
import { absoluteUrl, alternatesFor, localePath, ogLocale, siteName } from '@/lib/seo'
import { JsonLd } from '@/components/json-ld'
import type { BlogPosting, BreadcrumbList, WithContext } from 'schema-dts'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}): Promise<Metadata> {
  const { id, lang } = await params
  const locale: Locale = isLocale(lang) ? lang : defaultLocale
  const post = await getPost(Number(id))
  if (!post) return { title: locale === 'ru' ? 'Пост не найден' : 'פוסט לא נמצא' }
  const title = pick(locale, post.title, post.title_ru)
  const description = pick(locale, post.excerpt, post.excerpt_ru)
  const path = `/posts/${post.id}`
  const image = post.image_url?.startsWith('/') ? absoluteUrl(post.image_url) : post.image_url
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
      publishedTime: post.created_at || undefined,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: image ? { card: 'summary_large_image', images: [image] } : undefined,
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}) {
  const { id, lang } = await params
  const locale: Locale = isLocale(lang) ? lang : defaultLocale
  const dict = getDictionary(locale)

  const post = await getPost(Number(id))
  if (!post) notFound()

  const related = (await getPosts())
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3)

  const categorySlug = getSlugByCategory(post.category)
  const backHref = categorySlug ? `/categories/${categorySlug}` : '/'
  const catLabel = localizedCategoryTitle(post.category, locale)

  const title = pick(locale, post.title, post.title_ru)
  const bodyText = pick(locale, post.body, post.body_ru)
  const paragraphs = bodyText.split('\n').filter((p) => p.trim().length > 0)

  const postUrl = absoluteUrl(localePath(locale, `/posts/${post.id}`))
  const ogImage = post.image_url?.startsWith('/') ? absoluteUrl(post.image_url) : post.image_url

  const articleLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: pick(locale, post.excerpt, post.excerpt_ru),
    image: ogImage || undefined,
    datePublished: post.created_at || undefined,
    inLanguage: locale,
    mainEntityOfPage: postUrl,
    author: { '@type': 'Organization', name: siteName[locale] },
    publisher: {
      '@type': 'Organization',
      name: siteName[locale],
      logo: { '@type': 'ImageObject', url: absoluteUrl('/icon.png') },
    },
  }

  const breadcrumbLd: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: siteName[locale], item: absoluteUrl(localePath(locale, '')) },
      { '@type': 'ListItem', position: 2, name: catLabel, item: absoluteUrl(localePath(locale, backHref)) },
      { '@type': 'ListItem', position: 3, name: title, item: postUrl },
    ],
  }

  return (
    <main className="bg-background">
      <JsonLd data={[articleLd, breadcrumbLd]} />
      {/* Hero image */}
      <div className="relative h-[300px] w-full overflow-hidden sm:h-[420px]">
        <img src={post.image_url || '/placeholder.svg'} alt={title} className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-8">
          <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {catLabel}
          </span>
          <h1 className="font-heading text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-white/90">
            <CalendarDays className="size-4" />
            {formatDate(post.created_at, locale)}
          </p>
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

        {post.gallery && post.gallery.length > 0 && (
          <PostGallery images={post.gallery} title={title} heading={dict.post.gallery} />
        )}

        <div className="mt-10 border-t border-border pt-6">
          <LocaleLink
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowRight className="size-4" />
            {dict.post.back}
            {catLabel}
          </LocaleLink>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-cream/60">
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
              {dict.post.more}
              {catLabel}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
