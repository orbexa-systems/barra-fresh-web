'use client'

import { useState } from 'react'
import Image from 'next/image'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/utils'
import { CartProvider, useCart } from '@/components/menu/CartContext'
import { CartBar } from '@/components/menu/CartBar'
import { SaladConfigurator } from '@/components/menu/SaladConfigurator'
import { WhatsAppFloatingButton } from '@/components/ui/WhatsAppButton'
import type { Producto } from '@/lib/data/productos'
import type { Categoria } from '@/lib/data/categorias'
import type { TamanoEnsalada, Topping, Aderezo } from '@/lib/data/configurador'

interface MenuClientProps {
  productos: Producto[]
  categorias: Categoria[]
  tamanos: TamanoEnsalada[]
  toppings: Topping[]
  aderezos: Aderezo[]
}

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

function FloatingButtonGuard() {
  const { items } = useCart()
  if (items.length > 0) return null
  return <WhatsAppFloatingButton />
}

function ProductCard({ producto }: { producto: Producto }) {
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  function handleAdd() {
    addItem({ name: producto.nombre, price: producto.precio })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-brand-surface flex items-center justify-center">
            <span className="text-4xl">🥗</span>
          </div>
        )}
        {producto.destacado && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-brand-primary-light text-white text-xs font-bold rounded-full shadow-sm">
            Popular
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-brand-primary transition-colors duration-200">
          {producto.nombre}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {producto.descripcion}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-extrabold text-brand-primary">
            {formatPrice(producto.precio)}
          </span>
          <button
            onClick={handleAdd}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light focus-visible:ring-offset-2 ${
              justAdded ? 'bg-emerald-500' : 'bg-brand-primary hover:bg-brand-primary-dark'
            }`}
            aria-label={`Agregar ${producto.nombre} al pedido`}
          >
            {justAdded ? (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Agregado
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                  <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}

function MenuContent({ productos, categorias, tamanos, toppings, aderezos }: MenuClientProps) {
  const { items } = useCart()
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const ensaladaCatId = categorias.find(c => c.nombre.toLowerCase() === 'ensaladas')?.id
  const showSalads = activeCategory === 'all' || activeCategory === ensaladaCatId

  const filteredProducts =
    activeCategory === 'all'
      ? productos.filter(p => p.categoria_id !== ensaladaCatId)
      : activeCategory === ensaladaCatId
      ? []
      : productos.filter(p => p.categoria_id === activeCategory)

  return (
    <div className={items.length > 0 ? 'pb-20' : ''}>
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light focus-visible:ring-offset-2 ${
            activeCategory === 'all'
              ? 'bg-brand-primary text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-brand-surface hover:text-brand-primary-dark'
          }`}
        >
          🍽️ Todos
        </button>
        {categorias.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light focus-visible:ring-offset-2 ${
              activeCategory === cat.id
                ? 'bg-brand-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-brand-surface hover:text-brand-primary-dark'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {showSalads && (
          <SaladConfigurator tamanos={tamanos} toppings={toppings} aderezos={aderezos} />
        )}
        {filteredProducts.map(producto => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>

      {/* CTA genérico */}
      <div className="text-center mt-12">
        <a
          href={buildWhatsAppUrl('Hola, tengo una pregunta sobre el menú de BarraFresh.')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light focus-visible:ring-offset-2"
        >
          ¿Preguntas? Escríbenos por WhatsApp
          {WA_ICON}
        </a>
      </div>
    </div>
  )
}

export function MenuClient(props: MenuClientProps) {
  return (
    <CartProvider>
      <MenuContent {...props} />
      <CartBar />
      <FloatingButtonGuard />
    </CartProvider>
  )
}
