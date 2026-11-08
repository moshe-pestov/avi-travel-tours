import { SiteLinkButton } from '@/components/site-button'
import { SectionHeading } from '@/components/section-heading'
import { LocaleLink } from '@/components/locale-link'
import { pick, type Locale } from '@/lib/i18n'
import type { Dictionary } from '@/lib/dictionaries'
import type { Post } from '@/lib/mock-data'

export function ToursSection({
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
    <section id="tours" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <SectionHeading className="mb-10">{dict.toursHome.heading}</SectionHeading>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((post) => {
          const title = pick(locale, post.title, post.title_ru)
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
              <div className="flex flex-1 flex-col items-center gap-4 p-5 text-center">
                <h3 className="font-heading text-lg font-bold leading-snug text-foreground text-balance">
                  <LocaleLink href={`/posts/${post.id}`} className="transition-colors hover:text-primary">
                    {title}
                  </LocaleLink>
                </h3>
                <SiteLinkButton href={`/posts/${post.id}`} variant="outline" className="mt-auto">
                  {dict.toursHome.details}
                </SiteLinkButton>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <SiteLinkButton href="/categories/romania-vacations" size="lg">
          {dict.toursHome.all}
        </SiteLinkButton>
      </div>
    </section>
  )
}
