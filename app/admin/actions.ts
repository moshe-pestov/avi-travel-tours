'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  checkCredentials,
  createSession,
  destroySession,
  isAuthenticated,
} from '@/lib/auth'
import {
  updateSpeciality,
  createSpeciality,
  deleteSpeciality,
  updateTestimonial,
  createTestimonial,
  deleteTestimonial,
  updatePost,
  createPost,
  deletePost,
  updateSetting,
  isDbConfigured,
} from '@/lib/db'

export type LoginState = { error: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const user = String(formData.get('user') || '').trim()
  const password = String(formData.get('password') || '')

  if (!checkCredentials(user, password)) {
    return { error: 'שם משתמש או סיסמה שגויים.' }
  }
  await createSession()
  redirect('/admin')
}

export async function logoutAction(): Promise<void> {
  await destroySession()
  redirect('/admin/login')
}

async function requireAuth() {
  if (!(await isAuthenticated())) redirect('/admin/login')
}

function dbGuard() {
  if (!isDbConfigured()) {
    return 'בסביבת התצוגה המקדימה אין חיבור למסד נתונים. השינויים יישמרו בסביבת הייצור עם משתני הסביבה.'
  }
  return null
}

export type SaveState = { status: 'idle' | 'success' | 'error'; message: string }

/** Read an uploaded image file and return a data URL (stored in the DB LONGTEXT column). */
async function fileToDataUrl(file: File | null): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('גודל התמונה חורג מ-2MB.')
  }
  const buf = Buffer.from(await file.arrayBuffer())
  const mime = file.type || 'image/jpeg'
  return `data:${mime};base64,${buf.toString('base64')}`
}

export async function saveSpecialityAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAuth()
  const guard = dbGuard()
  if (guard) return { status: 'error', message: guard }

  const id = Number(formData.get('id'))
  const title = String(formData.get('title') || '').trim()
  const title_ru = String(formData.get('title_ru') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const description_ru = String(formData.get('description_ru') || '').trim()
  const body = String(formData.get('body') || '').trim()
  const body_ru = String(formData.get('body_ru') || '').trim()

  if (!title) return { status: 'error', message: 'יש להזין כותרת.' }

  try {
    const image_url = await fileToDataUrl(formData.get('image') as File | null)
    const gallery = await collectGallery(formData)
    await updateSpeciality(id, { title, title_ru, description, description_ru, body, body_ru, image_url, gallery })
    revalidatePath('/[lang]', 'layout')
    revalidatePath('/admin')
    return { status: 'success', message: 'נשמר בהצלחה.' }
  } catch (err) {
    return { status: 'error', message: (err as Error)?.message || 'שגיאה בשמירה.' }
  }
}

export async function createSpecialityAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAuth()
  const guard = dbGuard()
  if (guard) return { status: 'error', message: guard }

  const title = String(formData.get('title') || '').trim()
  const title_ru = String(formData.get('title_ru') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const description_ru = String(formData.get('description_ru') || '').trim()
  const body = String(formData.get('body') || '').trim()
  const body_ru = String(formData.get('body_ru') || '').trim()
  if (!title) return { status: 'error', message: 'יש להזין כותרת.' }

  try {
    const image_url = (await fileToDataUrl(formData.get('image') as File | null)) || '/placeholder.svg'
    const gallery = await collectGallery(formData)
    await createSpeciality({ title, title_ru, description, description_ru, body, body_ru, image_url, gallery })
    revalidatePath('/[lang]', 'layout')
    revalidatePath('/admin')
    return { status: 'success', message: 'נוסף בהצלחה.' }
  } catch (err) {
    return { status: 'error', message: (err as Error)?.message || 'שגיאה בהוספה.' }
  }
}

export async function deleteSpecialityAction(formData: FormData): Promise<void> {
  await requireAuth()
  if (dbGuard()) return
  const id = Number(formData.get('id'))
  await deleteSpeciality(id)
  revalidatePath('/[lang]', 'layout')
  revalidatePath('/admin')
}

/* ------------------------- Testimonials ------------------------ */

function parseTestimonial(formData: FormData) {
  const quote = String(formData.get('quote') || '').trim()
  const quote_ru = String(formData.get('quote_ru') || '').trim()
  const name = String(formData.get('name') || '').trim()
  const name_ru = String(formData.get('name_ru') || '').trim()
  const place = String(formData.get('place') || '').trim()
  const place_ru = String(formData.get('place_ru') || '').trim()
  const rating = Math.max(1, Math.min(5, Number(formData.get('rating')) || 5))
  return { quote, quote_ru, name, name_ru, place, place_ru, rating }
}

export async function saveTestimonialAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAuth()
  const guard = dbGuard()
  if (guard) return { status: 'error', message: guard }

  const id = Number(formData.get('id'))
  const data = parseTestimonial(formData)
  if (!data.quote || !data.name) return { status: 'error', message: 'יש להזין חוות דעת ושם.' }

  try {
    await updateTestimonial(id, data)
    revalidatePath('/[lang]', 'layout')
    revalidatePath('/admin')
    return { status: 'success', message: 'נשמר בהצלחה.' }
  } catch (err) {
    return { status: 'error', message: (err as Error)?.message || 'שגיאה בשמירה.' }
  }
}

export async function createTestimonialAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAuth()
  const guard = dbGuard()
  if (guard) return { status: 'error', message: guard }

  const data = parseTestimonial(formData)
  if (!data.quote || !data.name) return { status: 'error', message: 'יש להזין חוות דעת ושם.' }

  try {
    await createTestimonial(data)
    revalidatePath('/[lang]', 'layout')
    revalidatePath('/admin')
    return { status: 'success', message: 'נוסף בהצלחה.' }
  } catch (err) {
    return { status: 'error', message: (err as Error)?.message || 'שגיאה בהוספה.' }
  }
}

export async function deleteTestimonialAction(formData: FormData): Promise<void> {
  await requireAuth()
  if (dbGuard()) return
  const id = Number(formData.get('id'))
  await deleteTestimonial(id)
  revalidatePath('/[lang]', 'layout')
  revalidatePath('/admin')
}

/* ---------------------------- Posts ---------------------------- */

const MAX_GALLERY = 15

/** Build the final gallery array: kept existing URLs + newly uploaded files, capped at 15. */
async function collectGallery(formData: FormData): Promise<string[]> {
  const kept: string[] = []
  const existingRaw = String(formData.get('existing_gallery') || '')
  if (existingRaw) {
    try {
      const arr = JSON.parse(existingRaw)
      if (Array.isArray(arr)) kept.push(...arr.filter((x) => typeof x === 'string'))
    } catch {
      // ignore malformed value
    }
  }

  const files = formData.getAll('gallery_files') as File[]
  const uploaded: string[] = []
  for (const file of files) {
    if (uploaded.length + kept.length >= MAX_GALLERY) break
    const url = await fileToDataUrl(file)
    if (url) uploaded.push(url)
  }

  return [...kept, ...uploaded].slice(0, MAX_GALLERY)
}

function parsePostFields(formData: FormData) {
  const category = String(formData.get('category') || 'טיולים').trim() || 'טיולים'
  const title = String(formData.get('title') || '').trim()
  const title_ru = String(formData.get('title_ru') || '').trim()
  const excerpt = String(formData.get('excerpt') || '').trim()
  const excerpt_ru = String(formData.get('excerpt_ru') || '').trim()
  const body = String(formData.get('body') || '').trim()
  const body_ru = String(formData.get('body_ru') || '').trim()
  return { category, title, title_ru, excerpt, excerpt_ru, body, body_ru }
}

export async function savePostAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAuth()
  const guard = dbGuard()
  if (guard) return { status: 'error', message: guard }

  const id = Number(formData.get('id'))
  const fields = parsePostFields(formData)
  if (!fields.title) return { status: 'error', message: 'יש להזין כותרת.' }

  try {
    const image_url = await fileToDataUrl(formData.get('image') as File | null)
    const gallery = await collectGallery(formData)
    await updatePost(id, { ...fields, image_url, gallery })
    revalidatePath('/[lang]', 'layout')
    revalidatePath('/admin')
    return { status: 'success', message: 'הפוסט נשמר בהצלחה.' }
  } catch (err) {
    return { status: 'error', message: (err as Error)?.message || 'שגיאה בשמירה.' }
  }
}

export async function createPostAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAuth()
  const guard = dbGuard()
  if (guard) return { status: 'error', message: guard }

  const fields = parsePostFields(formData)
  if (!fields.title) return { status: 'error', message: 'יש להזין כותרת.' }

  try {
    const image_url = await fileToDataUrl(formData.get('image') as File | null)
    const gallery = await collectGallery(formData)
    await createPost({ ...fields, image_url, gallery })
    revalidatePath('/[lang]', 'layout')
    revalidatePath('/admin')
    return { status: 'success', message: 'הפוסט נוסף בהצלחה.' }
  } catch (err) {
    return { status: 'error', message: (err as Error)?.message || 'שגיאה בהוספה.' }
  }
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAuth()
  if (dbGuard()) return
  const id = Number(formData.get('id'))
  await deletePost(id)
  revalidatePath('/[lang]', 'layout')
  revalidatePath('/admin')
}

export async function saveSettingsAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAuth()
  const guard = dbGuard()
  if (guard) return { status: 'error', message: guard }

  const keys = [
    'banner_text',
    'banner_text_ru',
    'banner_badge',
    'banner_badge_ru',
    'hero_title',
    'hero_title_ru',
    'hero_subtitle',
    'hero_subtitle_ru',
    'specialities_heading',
    'specialities_heading_ru',
    'phone',
    'whatsapp',
  ]
  try {
    for (const key of keys) {
      const value = String(formData.get(key) ?? '').trim()
      await updateSetting(key, value)
    }
    revalidatePath('/[lang]', 'layout')
    revalidatePath('/admin')
    return { status: 'success', message: 'הטקסטים נשמרו בהצלחה.' }
  } catch (err) {
    return { status: 'error', message: (err as Error)?.message || 'שגיאה בשמירה.' }
  }
}
