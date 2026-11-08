import { CalendarDays, ChevronLeft } from 'lucide-react'
import { LocaleLink } from '@/components/locale-link'
import { formatDate } from '@/lib/format'
import { pick, type Locale } from '@/lib/i18n'
import { localizedCategoryTitle } from '@/lib/categories'
import { getDictionary } from '@/lib/dictionaries'
import type { Post } from '@/lib/mock-data'

export function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const dict = getDictionary(locale)
  const title = pick(locale, post.title, post.title_ru)
  const excerpt = pick(locale, post.excerpt, post.excerpt_ru)

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <LocaleLink href={`/posts/${post.id}`} className="block aspect-[16/10] overflow-hidden">
        <img
          src={post.image_url || '/placeholder.svg'}
          alt={title}
          className="size-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </LocaleLink>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-primary">
            {localizedCategoryTitle(post.category, locale)}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            {formatDate(post.created_at, locale)}
          </span>
        </div>
        <h3 className="font-heading text-lg font-bold leading-snug text-foreground text-balance">
          <LocaleLink href={`/posts/${post.id}`} className="hover:text-primary">
            {title}
          </LocaleLink>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>
        <LocaleLink
          href={`/posts/${post.id}`}
          className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-accent hover:underline"
        >
          {dict.postCard.readMore}
          <ChevronLeft className="size-4" />
        </LocaleLink>
      </div>
    </article>
  )
}
