// Slug-based configuration for the dedicated category pages.
// Each category from the post data gets its own page under /categories/[slug].

import type { Locale } from '@/lib/i18n'
import { pick } from '@/lib/i18n'

export type CategoryConfig = {
  slug: string
  category: string // must match the `category` value stored on posts (Hebrew, canonical)
  title: string
  title_ru: string
  description: string
  description_ru: string
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: 'daily-tours',
    category: 'טיולים יומיים',
    title: 'טיולים יומיים',
    title_ru: 'Однодневные туры',
    description: 'טיולי יום מודרכים ברחבי רומניה — יציאה בבוקר, חזרה בערב, חוויה שלמה ביום אחד.',
    description_ru:
      'Однодневные экскурсии по Румынии с гидом — выезд утром, возвращение вечером, целое приключение за один день.',
  },
  {
    slug: 'multiday-tours',
    category: 'טיולים למספר ימים',
    title: 'טיולים למספר ימים',
    title_ru: 'Многодневные туры',
    description: 'מסלולים מודרכים בני מספר ימים, כולל לינה ותחבורה, לגילוי רומניה לעומק ובנחת.',
    description_ru:
      'Многодневные маршруты с гидом, включая проживание и транспорт, чтобы познакомиться с Румынией глубже и без спешки.',
  },
  {
    slug: 'romania-vacations',
    category: 'חופשות ברומניה',
    title: 'חופשות ברומניה',
    title_ru: 'Отдых в Румынии',
    description: 'חבילות חופשה מלאות ברומניה — לזוגות, משפחות וקבוצות, בין נופים, טירות ואתרי טבע.',
    description_ru:
      'Полноценные пакеты отдыха в Румынии — для пар, семей и групп, среди пейзажей, замков и природных достопримечательностей.',
  },
  {
    slug: 'services',
    category: 'השירותים שלנו',
    title: 'השירותים שלנו',
    title_ru: 'Наши услуги',
    description: 'כל השירותים שאנחנו מציעים כדי שהחופשה שלכם ברומניה תהיה מושלמת ורגועה מהתכנון ועד החזרה.',
    description_ru:
      'Все услуги, которые мы предлагаем, чтобы ваш отдых в Румынии был идеальным и спокойным — от планирования до возвращения.',
  },
  {
    slug: 'deals',
    category: 'מבצעים',
    title: 'מבצעים',
    title_ru: 'Акции',
    description: 'ההצעות והמבצעים המשתלמים ביותר שלנו לטיולים וחופשות ברומניה.',
    description_ru: 'Наши самые выгодные предложения и акции на туры и отдых в Румынии.',
  },
  {
    slug: 'sites-attractions',
    category: 'אתרים ואטרקציות',
    title: 'אתרים ואטרקציות',
    title_ru: 'Достопримечательности',
    description: 'האתרים, הטירות והאטרקציות שאסור לפספס בטיול ברומניה.',
    description_ru: 'Достопримечательности, замки и места, которые нельзя пропустить в путешествии по Румынии.',
  },
  {
    slug: 'blog',
    category: 'בלוג',
    title: 'הבלוג שלנו',
    title_ru: 'Наш блог',
    description: 'טיפים, מדריכים וסיפורים מהשטח שיעזרו לכם לתכנן את הטיול המושלם ברומניה.',
    description_ru: 'Советы, гиды и истории с мест, которые помогут спланировать идеальное путешествие по Румынии.',
  },
]

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getSlugByCategory(category: string): string | undefined {
  return CATEGORIES.find((c) => c.category === category)?.slug
}

/** Localized display title for a Hebrew (canonical) category value. */
export function localizedCategoryTitle(category: string, locale: Locale): string {
  const cfg = CATEGORIES.find((c) => c.category === category)
  if (!cfg) return category
  return pick(locale, cfg.title, cfg.title_ru)
}
