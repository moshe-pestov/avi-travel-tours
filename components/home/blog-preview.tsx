import { ChevronLeft } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { SiteLinkButton } from '@/components/site-button'
import { LocaleLink } from '@/components/locale-link'
import { pick, type Locale } from '@/lib/i18n'
import type { Dictionary } from '@/lib/dictionaries'
import type { Post } from '@/lib/mock-data'

export function BlogPreview({
  posts,
  locale,
  dict,
}: {
  posts: Post[]
  locale: Locale
  dict: Dictionary
}) {
  const items = posts.slice(0, 4)
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
      <SectionHeading className="mb-10">{dict.services.heading}</SectionHeading>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((post) => {
          const title = pick(locale, post.title, post.title_ru)
          const excerpt = pick(locale, post.excerpt, post.excerpt_ru)
          return (
            <article
              key={post.id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <LocaleLink href={`/posts/${post.id}`} className="aspect-[4/3] overflow-hidden">
                <img
                  src={post.image_url || '/placeholder.svg'}
                  alt={title}
                  className="size-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </LocaleLink>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-heading text-base font-bold leading-snug text-foreground text-balance">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{excerpt}</p>
                <LocaleLink
                  href={`/posts/${post.id}`}
                  className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-orange hover:underline"
                >
                  {dict.services.readMore}
                  <ChevronLeft className="size-4" />
                </LocaleLink>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <SiteLinkButton href="/categories/services" size="lg" variant="outline">
          {dict.services.all}
        </SiteLinkButton>
      </div>
    </section>
  )
}
