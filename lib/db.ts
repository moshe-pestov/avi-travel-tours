import 'server-only'
import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from 'mysql2/promise'
import {
  mockPosts,
  mockSpecialities,
  mockSettings,
  mockTestimonials,
  type Post,
  type Speciality,
  type Testimonial,
} from './mock-data'

/**
 * MySQL connection layer.
 *
 * Credentials are read from environment variables (provided by cPanel):
 *   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
 *
 * On the first query we make sure the tables exist (CREATE TABLE IF NOT EXISTS)
 * and seed them with mock data if they are empty.
 *
 * If the database is unreachable (e.g. inside the preview environment without a
 * live cPanel MySQL) every query falls back to the in-memory mock data so the
 * site still renders.
 */

let pool: Pool | null = null
let schemaReady: Promise<boolean> | null = null

function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      connectTimeout: 8000,
      charset: 'utf8mb4_unicode_ci',
    })
  }
  return pool
}

function hasConfig(): boolean {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME)
}

/**
 * Ensure tables exist and are seeded. Memoized so it only runs once per process.
 * Returns true when the DB is usable, false when we should fall back to mocks.
 */
async function ensureSchema(): Promise<boolean> {
  if (!hasConfig()) return false
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getPool()

      await db.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          category VARCHAR(80) NOT NULL DEFAULT 'טיולים',
          title VARCHAR(255) NOT NULL,
          title_ru VARCHAR(255),
          image_url LONGTEXT,
          excerpt TEXT,
          excerpt_ru TEXT,
          body LONGTEXT,
          body_ru LONGTEXT,
          gallery LONGTEXT,
          created_at DATE NOT NULL DEFAULT (CURRENT_DATE),
          published TINYINT(1) NOT NULL DEFAULT 1
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Defensive migration: add `gallery` to posts tables created before this column existed.
      try {
        await db.query('ALTER TABLE posts ADD COLUMN gallery LONGTEXT AFTER body')
      } catch {
        // Column already exists — ignore.
      }

      // Defensive migrations: add Russian columns to posts tables created before i18n.
      for (const stmt of [
        'ALTER TABLE posts ADD COLUMN title_ru VARCHAR(255) AFTER title',
        'ALTER TABLE posts ADD COLUMN excerpt_ru TEXT AFTER excerpt',
        'ALTER TABLE posts ADD COLUMN body_ru LONGTEXT AFTER body',
      ]) {
        try {
          await db.query(stmt)
        } catch {
          // Column already exists — ignore.
        }
      }

      await db.query(`
        CREATE TABLE IF NOT EXISTS specialities (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          title_ru VARCHAR(255),
          description TEXT,
          description_ru TEXT,
          body LONGTEXT,
          body_ru LONGTEXT,
          image_url LONGTEXT,
          gallery LONGTEXT,
          sort_order INT NOT NULL DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Defensive migration: add `body` to specialities tables created before this column existed.
      try {
        await db.query('ALTER TABLE specialities ADD COLUMN body LONGTEXT AFTER description')
      } catch {
        // Column already exists — ignore.
      }

      // Defensive migration: add `gallery` to specialities tables created before this column existed.
      try {
        await db.query('ALTER TABLE specialities ADD COLUMN gallery LONGTEXT AFTER image_url')
      } catch {
        // Column already exists — ignore.
      }

      // Defensive migrations: add Russian columns to specialities tables created before i18n.
      for (const stmt of [
        'ALTER TABLE specialities ADD COLUMN title_ru VARCHAR(255) AFTER title',
        'ALTER TABLE specialities ADD COLUMN description_ru TEXT AFTER description',
        'ALTER TABLE specialities ADD COLUMN body_ru LONGTEXT AFTER body',
      ]) {
        try {
          await db.query(stmt)
        } catch {
          // Column already exists — ignore.
        }
      }

      await db.query(`
        CREATE TABLE IF NOT EXISTS testimonials (
          id INT AUTO_INCREMENT PRIMARY KEY,
          quote TEXT NOT NULL,
          quote_ru TEXT,
          name VARCHAR(120) NOT NULL,
          name_ru VARCHAR(120),
          place VARCHAR(120),
          place_ru VARCHAR(120),
          rating TINYINT NOT NULL DEFAULT 5,
          sort_order INT NOT NULL DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Defensive migrations: add Russian columns to testimonials tables created before i18n.
      for (const stmt of [
        'ALTER TABLE testimonials ADD COLUMN quote_ru TEXT AFTER quote',
        'ALTER TABLE testimonials ADD COLUMN name_ru VARCHAR(120) AFTER name',
        'ALTER TABLE testimonials ADD COLUMN place_ru VARCHAR(120) AFTER place',
      ]) {
        try {
          await db.query(stmt)
        } catch {
          // Column already exists — ignore.
        }
      }

      await db.query(`
        CREATE TABLE IF NOT EXISTS settings (
          setting_key VARCHAR(120) PRIMARY KEY,
          setting_value LONGTEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `)

      // Seed posts if empty
      const [postRows] = await db.query<RowDataPacket[]>('SELECT COUNT(*) AS c FROM posts')
      if (postRows[0].c === 0) {
        for (const p of mockPosts) {
          await db.query(
            'INSERT INTO posts (category, title, title_ru, image_url, excerpt, excerpt_ru, body, body_ru, gallery, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              p.category,
              p.title,
              p.title_ru,
              p.image_url,
              p.excerpt,
              p.excerpt_ru,
              p.body,
              p.body_ru,
              JSON.stringify(p.gallery ?? []),
              p.created_at,
            ],
          )
        }
      }

      // Seed specialities if empty
      const [specRows] = await db.query<RowDataPacket[]>('SELECT COUNT(*) AS c FROM specialities')
      if (specRows[0].c === 0) {
        for (const s of mockSpecialities) {
          await db.query(
            'INSERT INTO specialities (title, title_ru, description, description_ru, body, body_ru, image_url, gallery, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              s.title,
              s.title_ru,
              s.description,
              s.description_ru,
              s.body,
              s.body_ru,
              s.image_url,
              JSON.stringify(s.gallery ?? []),
              s.sort_order,
            ],
          )
        }
      }

      // Seed testimonials if empty
      const [tRows] = await db.query<RowDataPacket[]>('SELECT COUNT(*) AS c FROM testimonials')
      if (tRows[0].c === 0) {
        for (const t of mockTestimonials) {
          await db.query(
            'INSERT INTO testimonials (quote, quote_ru, name, name_ru, place, place_ru, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [t.quote, t.quote_ru, t.name, t.name_ru, t.place, t.place_ru, t.rating, t.sort_order],
          )
        }
      }

      // Seed settings if empty
      const [setRows] = await db.query<RowDataPacket[]>('SELECT COUNT(*) AS c FROM settings')
      if (setRows[0].c === 0) {
        for (const s of mockSettings) {
          await db.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', [
            s.setting_key,
            s.setting_value,
          ])
        }
      }

      return true
    })().catch((err) => {
      console.log('[v0] MySQL unavailable, using mock data:', err?.message)
      schemaReady = null // allow retry on next request
      return false
    })
  }
  return schemaReady
}

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value ?? '').slice(0, 10)
}

function parseGallery(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[]
  if (typeof value !== 'string' || value.trim() === '') return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

function mapPost(r: RowDataPacket): Post {
  return {
    ...(r as Post),
    gallery: parseGallery(r.gallery),
    created_at: toDateString(r.created_at),
  }
}

function mapSpeciality(r: RowDataPacket): Speciality {
  return {
    ...(r as Speciality),
    gallery: parseGallery(r.gallery),
  }
}

/* ---------------------------- Posts ---------------------------- */

export async function getPosts(category?: string): Promise<Post[]> {
  const ready = await ensureSchema()
  if (!ready) {
    const list = category ? mockPosts.filter((p) => p.category === category) : mockPosts
    return [...list].sort((a, b) => b.created_at.localeCompare(a.created_at))
  }
  const db = getPool()
  const sql = category
    ? 'SELECT * FROM posts WHERE published = 1 AND category = ? ORDER BY created_at DESC, id DESC'
    : 'SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC, id DESC'
  const [rows] = await db.query<RowDataPacket[]>(sql, category ? [category] : [])
  return rows.map(mapPost)
}

export async function getPost(id: number): Promise<Post | null> {
  const ready = await ensureSchema()
  if (!ready) return mockPosts.find((p) => p.id === id) ?? null
  const db = getPool()
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM posts WHERE id = ? LIMIT 1', [id])
  if (rows.length === 0) return null
  return mapPost(rows[0])
}

export async function getCategories(): Promise<string[]> {
  const posts = await getPosts()
  return Array.from(new Set(posts.map((p) => p.category)))
}

/** Get every post regardless of published flag (used by the backoffice). */
export async function getAllPosts(): Promise<Post[]> {
  const ready = await ensureSchema()
  if (!ready) return [...mockPosts].sort((a, b) => b.created_at.localeCompare(a.created_at))
  const db = getPool()
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM posts ORDER BY created_at DESC, id DESC')
  return rows.map(mapPost)
}

type PostInput = {
  category: string
  title: string
  title_ru: string
  excerpt: string
  excerpt_ru: string
  body: string
  body_ru: string
  image_url?: string
  gallery: string[]
}

export async function updatePost(id: number, data: PostInput): Promise<void> {
  const ready = await ensureSchema()
  if (!ready) throw new Error('Database not configured')
  const db = getPool()
  const galleryJson = JSON.stringify(data.gallery.slice(0, 15))
  if (typeof data.image_url === 'string' && data.image_url.length > 0) {
    await db.query(
      'UPDATE posts SET category = ?, title = ?, title_ru = ?, excerpt = ?, excerpt_ru = ?, body = ?, body_ru = ?, gallery = ?, image_url = ? WHERE id = ?',
      [
        data.category,
        data.title,
        data.title_ru,
        data.excerpt,
        data.excerpt_ru,
        data.body,
        data.body_ru,
        galleryJson,
        data.image_url,
        id,
      ],
    )
  } else {
    await db.query(
      'UPDATE posts SET category = ?, title = ?, title_ru = ?, excerpt = ?, excerpt_ru = ?, body = ?, body_ru = ?, gallery = ? WHERE id = ?',
      [
        data.category,
        data.title,
        data.title_ru,
        data.excerpt,
        data.excerpt_ru,
        data.body,
        data.body_ru,
        galleryJson,
        id,
      ],
    )
  }
}

export async function createPost(data: PostInput): Promise<number> {
  const ready = await ensureSchema()
  if (!ready) throw new Error('Database not configured')
  const db = getPool()
  const galleryJson = JSON.stringify(data.gallery.slice(0, 15))
  const cover = data.image_url && data.image_url.length > 0 ? data.image_url : (data.gallery[0] ?? '/placeholder.svg')
  const [res] = await db.query<ResultSetHeader>(
    'INSERT INTO posts (category, title, title_ru, image_url, excerpt, excerpt_ru, body, body_ru, gallery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      data.category,
      data.title,
      data.title_ru,
      cover,
      data.excerpt,
      data.excerpt_ru,
      data.body,
      data.body_ru,
      galleryJson,
    ],
  )
  return res.insertId
}

export async function deletePost(id: number): Promise<void> {
  const ready = await ensureSchema()
  if (!ready) throw new Error('Database not configured')
  const db = getPool()
  await db.query('DELETE FROM posts WHERE id = ?', [id])
}

/* ------------------------- Specialities ------------------------ */

export async function getSpecialities(): Promise<Speciality[]> {
  const ready = await ensureSchema()
  if (!ready) return [...mockSpecialities].sort((a, b) => a.sort_order - b.sort_order)
  const db = getPool()
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM specialities ORDER BY sort_order ASC, id ASC')
  return rows.map(mapSpeciality)
}

export async function getSpeciality(id: number): Promise<Speciality | null> {
  const ready = await ensureSchema()
  if (!ready) return mockSpecialities.find((s) => s.id === id) ?? null
  const db = getPool()
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM specialities WHERE id = ? LIMIT 1', [id])
  return rows.length ? mapSpeciality(rows[0]) : null
}

export async function updateSpeciality(
  id: number,
  data: {
    title: string
    title_ru: string
    description: string
    description_ru: string
    body: string
    body_ru: string
    image_url?: string
    gallery: string[]
  },
): Promise<void> {
  const ready = await ensureSchema()
  if (!ready) throw new Error('Database not configured')
  const db = getPool()
  const galleryJson = JSON.stringify(data.gallery.slice(0, 15))
  if (typeof data.image_url === 'string' && data.image_url.length > 0) {
    await db.query(
      'UPDATE specialities SET title = ?, title_ru = ?, description = ?, description_ru = ?, body = ?, body_ru = ?, gallery = ?, image_url = ? WHERE id = ?',
      [
        data.title,
        data.title_ru,
        data.description,
        data.description_ru,
        data.body,
        data.body_ru,
        galleryJson,
        data.image_url,
        id,
      ],
    )
  } else {
    await db.query(
      'UPDATE specialities SET title = ?, title_ru = ?, description = ?, description_ru = ?, body = ?, body_ru = ?, gallery = ? WHERE id = ?',
      [
        data.title,
        data.title_ru,
        data.description,
        data.description_ru,
        data.body,
        data.body_ru,
        galleryJson,
        id,
      ],
    )
  }
}

export async function createSpeciality(data: {
  title: string
  title_ru: string
  description: string
  description_ru: string
  body: string
  body_ru: string
  image_url: string
  gallery: string[]
}): Promise<number> {
  const ready = await ensureSchema()
  if (!ready) throw new Error('Database not configured')
  const db = getPool()
  const galleryJson = JSON.stringify(data.gallery.slice(0, 15))
  const cover =
    data.image_url && data.image_url.length > 0 ? data.image_url : (data.gallery[0] ?? '/placeholder.svg')
  const [res] = await db.query<ResultSetHeader>(
    'INSERT INTO specialities (title, title_ru, description, description_ru, body, body_ru, image_url, gallery, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      data.title,
      data.title_ru,
      data.description,
      data.description_ru,
      data.body,
      data.body_ru,
      cover,
      galleryJson,
      99,
    ],
  )
  return res.insertId
}

export async function deleteSpeciality(id: number): Promise<void> {
  const ready = await ensureSchema()
  if (!ready) throw new Error('Database not configured')
  const db = getPool()
  await db.query('DELETE FROM specialities WHERE id = ?', [id])
}

/* ------------------------- Testimonials ------------------------ */

export async function getTestimonials(): Promise<Testimonial[]> {
  const ready = await ensureSchema()
  if (!ready) return [...mockTestimonials].sort((a, b) => a.sort_order - b.sort_order)
  const db = getPool()
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC',
  )
  return rows as Testimonial[]
}

export async function updateTestimonial(
  id: number,
  data: {
    quote: string
    quote_ru: string
    name: string
    name_ru: string
    place: string
    place_ru: string
    rating: number
  },
): Promise<void> {
  const ready = await ensureSchema()
  if (!ready) throw new Error('Database not configured')
  const db = getPool()
  await db.query(
    'UPDATE testimonials SET quote = ?, quote_ru = ?, name = ?, name_ru = ?, place = ?, place_ru = ?, rating = ? WHERE id = ?',
    [data.quote, data.quote_ru, data.name, data.name_ru, data.place, data.place_ru, data.rating, id],
  )
}

export async function createTestimonial(data: {
  quote: string
  quote_ru: string
  name: string
  name_ru: string
  place: string
  place_ru: string
  rating: number
}): Promise<number> {
  const ready = await ensureSchema()
  if (!ready) throw new Error('Database not configured')
  const db = getPool()
  const [res] = await db.query<ResultSetHeader>(
    'INSERT INTO testimonials (quote, quote_ru, name, name_ru, place, place_ru, rating, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [data.quote, data.quote_ru, data.name, data.name_ru, data.place, data.place_ru, data.rating, 99],
  )
  return res.insertId
}

export async function deleteTestimonial(id: number): Promise<void> {
  const ready = await ensureSchema()
  if (!ready) throw new Error('Database not configured')
  const db = getPool()
  await db.query('DELETE FROM testimonials WHERE id = ?', [id])
}

/* --------------------------- Settings -------------------------- */

export async function getSettings(): Promise<Record<string, string>> {
  const ready = await ensureSchema()
  if (!ready) {
    return Object.fromEntries(mockSettings.map((s) => [s.setting_key, s.setting_value]))
  }
  const db = getPool()
  const [rows] = await db.query<RowDataPacket[]>('SELECT setting_key, setting_value FROM settings')
  return Object.fromEntries(rows.map((r) => [r.setting_key as string, r.setting_value as string]))
}

export async function updateSetting(key: string, value: string): Promise<void> {
  const ready = await ensureSchema()
  if (!ready) throw new Error('Database not configured')
  const db = getPool()
  await db.query(
    'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
    [key, value, value],
  )
}

export function isDbConfigured(): boolean {
  return hasConfig()
}
