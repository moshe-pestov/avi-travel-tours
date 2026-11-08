import type { Metadata } from 'next'
import { CalendarDays, ChevronLeft } from 'lucide-react'
import { PostCard } from '@/components/post-card'
import { SectionHeading } from '@/components/section-heading'
import { LocaleLink } from '@/components/locale-link'
import { getPosts } from '@/lib/db'
import { getDictionary } from '@/lib/dictionaries'
import { formatDate } from '@/lib/format'
import { pick, type Locale } from '@/lib/i18n'
import { absoluteUrl, alternatesFor, localePath, ogLocale } from '@/lib/seo'

const BLOG_CATEGORY = 'בלוג'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  const dict = getDictionary(lang)
  return {
    title: dict.blog.heading,
    description: dict.blog.description,
    alternates: alternatesFor(lang, '/blog'),
    openGraph: {
      title: dict.blog.heading,
      description: dict.blog.description,
      url: absoluteUrl(localePath(lang, '/blog')),
      locale: ogLocale[lang],
    },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = getDictionary(lang)
  const posts = await getPosts(BLOG_CATEGORY)

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <SectionHeading className="mb-4">{dict.blog.heading}</SectionHeading>
        <p className="mx-auto mb-12 max-w-2xl text-center leading-relaxed text-muted-foreground text-pretty">
          {dict.blog.description}
        </p>

        {posts.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">{dict.blog.empty}</p>
        ) : (
          <div className="flex flex-col gap-12">
            {featured && (
              <LocaleLink
                href={`/posts/${featured.id}`}
                className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md lg:grid-cols-2"
              >
                <div className="aspect-[16/10] overflow-hidden lg:aspect-auto">
                  <img
                    src={featured.image_url || '/placeholder.svg'}
                    alt={pick(lang, featured.title, featured.title_ru)}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center gap-4 p-6 lg:p-10">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-accent/10 px-3 py-1 font-semibold text-accent">
                      {dict.blog.featured}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3.5" />
                      {formatDate(featured.created_at, lang)}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl font-bold leading-tight text-foreground text-balance lg:text-3xl">
                    {pick(lang, featured.title, featured.title_ru)}
                  </h2>
                  <p className="line-clamp-3 leading-relaxed text-muted-foreground">
                    {pick(lang, featured.excerpt, featured.excerpt_ru)}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:underline">
                    {dict.postCard.readMore}
                    <ChevronLeft className="size-4 rtl:rotate-180" />
                  </span>
                </div>
              </LocaleLink>
            )}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} locale={lang} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
