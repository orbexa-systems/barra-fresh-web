import type { Metadata } from 'next'
import Link from 'next/link'
import { MenuClient } from '@/components/menu/MenuClient'
import { BUSINESS_INFO } from '@/lib/data'
import { getCategorias } from '@/lib/data/categorias'
import { getProductos } from '@/lib/data/productos'
import { getTamanos, getToppings, getAderezos } from '@/lib/data/configurador'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://barra-fresh-web.vercel.app'

export const metadata: Metadata = {
  title: 'Menú Digital | BarraFresh',
  description:
    'Menú completo de BarraFresh: ensaladas frescas, jugos naturales, licuados, smoothies, yogurt y snacks saludables en Atizapán de Zaragoza. Haz tu pedido por WhatsApp.',
  keywords: [
    'menú comida saludable',
    'ensaladas frescas Atizapán',
    'jugos naturales Estado de México',
    'smoothies saludables',
    'licuados naturales',
    'comida saludable Atizapán de Zaragoza',
    'BarraFresh menú',
    'pedido WhatsApp comida saludable',
  ],
  openGraph: {
    title: 'Menú Digital BarraFresh',
    description:
      'Ensaladas, jugos, licuados, smoothies y más. Todo fresco y preparado al momento. Haz tu pedido por WhatsApp.',
    url: `${BASE_URL}/menu`,
    siteName: 'BarraFresh',
    locale: 'es_MX',
    type: 'website',
  },
  alternates: {
    canonical: `${BASE_URL}/menu`,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: BUSINESS_INFO.name,
  telephone: BUSINESS_INFO.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS_INFO.address,
    addressLocality: 'Atizapán de Zaragoza',
    addressRegion: 'Estado de México',
    postalCode: '52928',
    addressCountry: 'MX',
  },
  servesCuisine: ['Comida saludable', 'Ensaladas', 'Jugos naturales'],
  hasMenu: `${BASE_URL}/menu`,
}

export const dynamic = 'force-dynamic'

export default async function MenuPage() {
  const [categorias, productos, tamanos, toppings, aderezos] = await Promise.all([
    getCategorias(),
    getProductos(),
    getTamanos(),
    getToppings(),
    getAderezos(),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Minimal header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-brand-primary text-xl tracking-tight hover:text-brand-primary-dark transition-colors"
            aria-label="Ir al inicio de BarraFresh"
          >
            🌿 BarraFresh
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-primary transition-colors focus:outline-none focus-visible:underline"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Inicio
          </Link>
        </div>
      </header>

      <main>
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-surface-mid text-brand-primary-dark text-sm font-semibold mb-4">
                Menú Digital
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                ¿Qué vas a{' '}
                <span className="text-brand-primary">ordenar hoy?</span>
              </h1>
              <p className="text-gray-500 text-base max-w-xl mx-auto">
                Todo preparado al momento con ingredientes frescos. Da clic en{' '}
                <strong className="text-brand-primary">Ordenar</strong> para pedir por WhatsApp.
              </p>
            </div>

            <MenuClient
              productos={productos}
              categorias={categorias}
              tamanos={tamanos}
              toppings={toppings}
              aderezos={aderezos}
            />
          </div>
        </section>
      </main>
    </>
  )
}
