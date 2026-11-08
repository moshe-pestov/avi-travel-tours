import { SettingsEditor } from '@/components/admin/settings-editor'
import { DbNotice } from '@/components/admin/db-notice'
import { getSettings } from '@/lib/db'

export default async function AdminTextsPage() {
  const settings = await getSettings()

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-primary">טקסטים באתר</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        עריכת הכותרות, טקסט הבאנר ופרטי הקשר המוצגים באתר.
      </p>

      <DbNotice />

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <SettingsEditor settings={settings} />
      </section>
    </div>
  )
}
