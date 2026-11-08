import type { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'
import { absoluteUrl, localePath } from '@/lib/seo'
import { CATEGORIES } from '@/lib/categories'
import { getAllPosts, getSpecialities } from '@/lib/db'

// Regenerate at most once an hour so newly published content shows up.
export const revalidate = 3600

type PathEntry = {
  path: string
  lastModified: Date
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tours] = await Promise.all([getAllPosts(), getSpecialities()])

  const now = new Date()

  const entries: PathEntry[] = [
    { path: '', lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { path: '/contact', lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { path: '/blog', lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    // The blog uses its dedicated /blog route (see above), so exclude it here.
    ...CATEGORIES.filter((c) => c.slug !== 'blog').map((c) => ({
      path: `/categories/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      path: `/posts/${p.id}`,
      lastModified: p.created_at ? new Date(p.created_at) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...tours.map((t) => ({
      path: `/tours/${t.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  // One sitemap URL per locale, each carrying hreflang alternates to the others.
  return entries.flatMap((entry) => {
    const languages: Record<string, string> = {}
    for (const l of locales) languages[l] = absoluteUrl(localePath(l, entry.path))

    return locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, entry.path)),
      lastModified: entry.lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: { languages },
    }))
  })
}
