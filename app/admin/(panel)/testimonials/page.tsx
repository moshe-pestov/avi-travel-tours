import { TestimonialEditor } from '@/components/admin/testimonial-editor'
import { AddTestimonial } from '@/components/admin/add-testimonial'
import { DbNotice } from '@/components/admin/db-notice'
import { getTestimonials } from '@/lib/db'

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-primary">חוות דעת</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        חוות הדעת המוצגות בסליידר בדף הבית.
      </p>

      <DbNotice />

      <section className="mb-10">
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">חוות הדעת הקיימות</h2>
        <div className="flex flex-col gap-4">
          {testimonials.map((t) => (
            <TestimonialEditor key={t.id} testimonial={t} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">הוספת חוות דעת</h2>
        <AddTestimonial />
      </section>
    </div>
  )
}
