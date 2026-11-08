import { Database } from 'lucide-react'
import { isDbConfigured } from '@/lib/db'

export function DbNotice() {
  if (isDbConfigured()) return null
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-foreground">
      <Database className="mt-0.5 size-5 shrink-0 text-accent" />
      <p>
        בסביבת התצוגה המקדימה אין חיבור למסד נתונים, כך שהשמירה מושבתת. בסביבת הייצור (cPanel) עם
        משתני הסביבה של MySQL — הטבלאות ייווצרו אוטומטית והעריכה תפעל במלואה.
      </p>
    </div>
  )
}
