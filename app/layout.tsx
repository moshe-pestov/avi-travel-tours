import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Heebo, Assistant, Rubik } from 'next/font/google'
import { headers } from 'next/headers'
import { isLocale, dir, defaultLocale } from '@/lib/i18n'
import { SITE_URL, siteName, siteDescription, siteKeywords } from '@/lib/seo'
import './globals.css'

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
})

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  variable: '--font-assistant',
  display: 'swap',
})

// Rubik supports Hebrew, Latin AND Cyrillic — used so Russian renders correctly.
const rubik = Rubik({
  subsets: ['hebrew', 'latin', 'cyrillic'],
  variable: '--font-rubik',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteName.he,
    template: `%s | ${siteName.he}`,
  },
  description: siteDescription.he,
  applicationName: siteName.he,
  generator: 'v0.app',
  keywords: siteKeywords.he,
  authors: [{ name: siteName.he }],
  creator: siteName.he,
  publisher: siteName.he,
  formatDetection: { telephone: true, email: true, address: false },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  alternates: {
    canonical: '/he',
    languages: { he: '/he', ru: '/ru', 'x-default': '/he' },
  },
  openGraph: {
    type: 'website',
    siteName: siteName.he,
    title: siteName.he,
    description: siteDescription.he,
    url: '/he',
    locale: 'he_IL',
    alternateLocale: ['ru_RU'],
    images: [{ url: '/images/og-cover.png', width: 1200, height: 630, alt: siteName.he }],
  },
  twitter: {
    // Title/description intentionally omitted so crawlers fall back to the
    // per-page localized og:title / og:description.
    card: 'summary_large_image',
    images: ['/images/og-cover.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#2e5233',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = await headers()
  const headerLocale = headerList.get('x-locale')
  const locale = isLocale(headerLocale) ? headerLocale : defaultLocale

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${heebo.variable} ${assistant.variable} ${rubik.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
