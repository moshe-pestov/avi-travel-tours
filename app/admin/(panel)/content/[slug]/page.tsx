import { notFound } from 'next/navigation'
import { PostEditor } from '@/components/admin/post-editor'
import { AddPost } from '@/components/admin/add-post'
import { DbNotice } from '@/components/admin/db-notice'
import { getAllPosts } from '@/lib/db'
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories'

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }))
}

export default async function AdminCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = getCategoryBySlug(slug)
  if (!config) notFound()

  const allPosts = await getAllPosts()
  const posts = allPosts.filter((p) => p.category === config.category)

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-primary">{config.title}</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        ניהול הפריטים בקטגוריית &quot;{config.title}&quot; — עריכת תוכן והעלאת גלריית תמונות (עד 15
        תמונות לכל פריט) שהלקוחות יוכלו לגלול ולצפות בהן.
      </p>

      <DbNotice />

      <section className="mb-10">
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
          פריטים קיימים ({posts.length})
        </h2>
        {posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((p) => (
              <PostEditor key={p.id} post={p} lockCategory />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            אין עדיין פריטים בקטגוריה זו. הוסיפו את הראשון למטה.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">
          הוספת פריט חדש ל&quot;{config.title}&quot;
        </h2>
        <AddPost category={config.category} />
      </section>
    </div>
  )
}
