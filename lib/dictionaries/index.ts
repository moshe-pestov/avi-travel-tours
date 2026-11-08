import type { Locale } from '@/lib/i18n'
import he, { type Dictionary } from './he'
import ru from './ru'

const dictionaries: Record<Locale, Dictionary> = { he, ru }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? he
}

export type { Dictionary }
