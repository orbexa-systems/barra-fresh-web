import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-8xl font-black text-brand-primary mb-4">404</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Página no encontrada
          </h1>
          <p className="text-gray-500 mb-8">
            Esta página no existe o fue movida. Pero el menú sí existe — y está delicioso.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-semibold transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
