import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { PostCard } from '@/components/post-card'
import { SectionHeading } from '@/components/section-heading'
import { getPosts } from '@/lib/db'
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories'
import { getDictionary } from '@/lib/dictionaries'
import { pick, type Locale } from '@/lib/i18n'
import { absoluteUrl, alternatesFor, localePath, ogLocale } from '@/lib/seo'

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: Locale }>
}): Promise<Metadata> {
  const { slug, lang } = await params
  const config = getCategoryBySlug(slug)
  if (!config) return { title: 'לא נמצא' }
  const title = pick(lang, config.title, config.title_ru)
  const description = pick(lang, config.description, config.description_ru)
  const path = `/categories/${config.slug}`
  return {
    title,
    description,
    alternates: alternatesFor(lang, path),
    openGraph: {
      title,
      description,
      url: absoluteUrl(localePath(lang, path)),
      locale: ogLocale[lang],
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; lang: Locale }>
}) {
  const { slug, lang } = await params
  const config = getCategoryBySlug(slug)
  if (!config) notFound()

  // The blog has its own dedicated, editorially designed page.
  if (slug === 'blog') redirect(`/${lang}/blog`)

  const dict = getDictionary(lang)
  const posts = await getPosts(config.category)

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <SectionHeading className="mb-4">{pick(lang, config.title, config.title_ru)}</SectionHeading>
        <p className="mx-auto mb-10 max-w-2xl text-center leading-relaxed text-muted-foreground text-pretty">
          {pick(lang, config.description, config.description_ru)}
        </p>

        {posts.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">{dict.category.empty}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} locale={lang} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
