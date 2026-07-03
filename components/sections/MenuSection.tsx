import { MenuClient } from '@/components/menu/MenuClient'

export function MenuSection() {
  return (
    <section id="menu" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-surface-mid text-brand-primary-dark text-sm font-semibold mb-4">
            Nuestro Menú
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Elige tu{' '}
            <span className="text-brand-primary">combinación perfecta</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Todos nuestros productos se preparan al momento con ingredientes
            frescos seleccionados cada día.
          </p>
        </div>
        <MenuClient />
      </div>
    </section>
  )
}
