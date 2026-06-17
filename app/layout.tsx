import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://barrafresh.mx'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'BarraFresh – Ensaladas, Jugos y Comida Saludable en Cuernavaca',
    template: '%s | BarraFresh',
  },
  description:
    'BarraFresh ofrece ensaladas frescas, jugos naturales, licuados, smoothies y yogurt preparado en Cuernavaca. Sin conservadores, sin colorantes. ¡Pide por WhatsApp!',
  keywords: [
    'ensaladas saludables Cuernavaca',
    'jugos naturales',
    'smoothies Cuernavaca',
    'comida saludable',
    'desayuno saludable',
    'licuados naturales',
    'yogurt preparado',
    'snacks saludables',
    'BarraFresh',
    'comida sana Morelos',
    'ensalada césar',
    'jugo verde detox',
  ],
  authors: [{ name: 'BarraFresh' }],
  creator: 'BarraFresh',
  publisher: 'BarraFresh',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: BASE_URL,
    siteName: 'BarraFresh',
    title: 'BarraFresh – Comida Saludable en Cuernavaca',
    description:
      'Ensaladas frescas, jugos naturales, licuados y smoothies preparados al momento. Sin conservadores. Visítanos o pide por WhatsApp.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BarraFresh – Comida saludable en Cuernavaca',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BarraFresh – Comida Saludable en Cuernavaca',
    description:
      'Ensaladas, jugos naturales, licuados y smoothies preparados al momento. Sin conservadores.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: 'BarraFresh',
    description:
      'Ensaladas frescas, jugos naturales, licuados nutritivos y yogurt preparado en Cuernavaca, Morelos.',
    url: BASE_URL,
    telephone: '+525613013325',
    email: 'contacto@barrafresh.mx',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Lirio 20, Col. Lomas de San Miguel',
      addressLocality: 'Atizapán de Zaragoza',
      addressRegion: 'Estado de México',
      postalCode: '52928',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.9242,
      longitude: -99.2216,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '09:00',
        closes: '15:00',
      },
    ],
    servesCuisine: ['Healthy', 'Salads', 'Juices', 'Smoothies'],
    priceRange: '$$',
    image: `${BASE_URL}/og-image.jpg`,
    sameAs: [
      'https://instagram.com/barrafresh',
      'https://facebook.com/barrafresh',
    ],
    hasMap: 'https://www.google.com/maps/search/?api=1&query=Av.+Saludable+123+Cuernavaca+Morelos',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '200',
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <html lang="es" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
