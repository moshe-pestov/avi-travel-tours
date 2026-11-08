'use server'

import { isMailConfigured, sendContactEmail } from '@/lib/mail'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

const MESSAGES = {
  he: {
    missing: 'נא למלא שם וגם אימייל או טלפון.',
    invalidEmail: 'כתובת האימייל אינה תקינה.',
    successPreview: 'תודה! פנייתכם התקבלה. (שרת הדוא"ל יופעל בסביבת הייצור עם משתני הסביבה)',
    success: 'תודה! פנייתכם נשלחה בהצלחה. נחזור אליכם בהקדם.',
    error: 'אירעה שגיאה בשליחת ההודעה. נסו שוב מאוחר יותר.',
  },
  ru: {
    missing: 'Пожалуйста, укажите имя, а также email или телефон.',
    invalidEmail: 'Некорректный адрес email.',
    successPreview: 'Спасибо! Ваша заявка получена. (Почтовый сервер заработает в продакшене с переменными окружения)',
    success: 'Спасибо! Ваша заявка успешно отправлена. Мы скоро свяжемся с вами.',
    error: 'Произошла ошибка при отправке сообщения. Попробуйте позже.',
  },
} as const

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const message = String(formData.get('message') || '').trim()
  const locale = String(formData.get('locale') || 'he') === 'ru' ? 'ru' : 'he'
  const t = MESSAGES[locale]

  if (!name || (!email && !phone)) {
    return { status: 'error', message: t.missing }
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: t.invalidEmail }
  }

  if (!isMailConfigured()) {
    // In the preview environment there is no SMTP server configured.
    console.log('[v0] SMTP not configured — contact submission:', { name, email, phone })
    return { status: 'success', message: t.successPreview }
  }

  try {
    await sendContactEmail({ name, email, phone, message })
    return { status: 'success', message: t.success }
  } catch (err) {
    console.log('[v0] Failed to send contact email:', (err as Error)?.message)
    return { status: 'error', message: t.error }
  }
}
