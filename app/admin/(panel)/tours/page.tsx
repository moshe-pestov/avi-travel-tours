import { SpecialityEditor } from '@/components/admin/speciality-editor'
import { AddSpeciality } from '@/components/admin/add-speciality'
import { DbNotice } from '@/components/admin/db-notice'
import { getSpecialities } from '@/lib/db'

export default async function AdminToursPage() {
  const specialities = await getSpecialities()

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-primary">טיולים</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        הכרטיסים המוצגים בדף הבית. לכל טיול יש עמוד ייעודי הנפתח בלחיצה על &quot;לפרטים&quot;, כולל
        גלריית תמונות.
      </p>

      <DbNotice />

      <section className="mb-10">
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">הטיולים הקיימים</h2>
        <div className="flex flex-col gap-4">
          {specialities.map((s) => (
            <SpecialityEditor key={s.id} speciality={s} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">הוספת טיול חדש</h2>
        <AddSpeciality />
      </section>
    </div>
  )
}
