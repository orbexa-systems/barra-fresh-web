'use client'

import { useState } from 'react'
import { FiltroCategorias } from './FiltroCategorias'
import { ProductoCard } from './ProductoCard'
import { ConfiguradorModal } from './ConfiguradorModal'
import type { Producto } from '@/lib/data/productos'
import type { Categoria } from '@/lib/data/categorias'
import type { TamanoEnsalada, Topping, Aderezo } from '@/lib/data/configurador'
import type { CartItem, EnsaladaConfig } from '@/app/pos/POSClient'

interface Props {
  categorias: Categoria[]
  productos: Producto[]
  cart: CartItem[]
  tamanos: TamanoEnsalada[]
  toppings: Topping[]
  aderezos: Aderezo[]
  onAgregarProducto: (producto: Producto) => void
  onAgregarEnsalada: (config: EnsaladaConfig) => void
}

export function Catalogo({ categorias, productos, cart, tamanos, toppings, aderezos, onAgregarProducto, onAgregarEnsalada }: Props) {
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const productosFiltrados = filtroCategoria
    ? productos.filter(p => p.categoria_id === filtroCategoria)
    : productos

  const tieneEnsaladas = categorias.some(c => c.nombre.toLowerCase().includes('ensalada'))

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[17px] font-bold text-gray-900">Catálogo</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">
              {productosFiltrados.filter(p => p.disponible).length} disponibles
            </p>
          </div>
          {tieneEnsaladas && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-surface border border-brand-primary text-brand-primary-dark text-[13px] font-semibold hover:bg-brand-surface-mid transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Armar ensalada
            </button>
          )}
        </div>
        <FiltroCategorias
          categorias={categorias.filter(c => c.activo)}
          selected={filtroCategoria}
          onSelect={setFiltroCategoria}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {productosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-gray-300" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-gray-700">Sin productos</p>
            <p className="text-[13px] text-gray-400 mt-1">No hay productos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
            {productosFiltrados.map(producto => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                cartItem={cart.find(i => i.id === producto.id)}
                onAgregar={onAgregarProducto}
              />
            ))}
          </div>
        )}
      </div>

      <ConfiguradorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tamanos={tamanos}
        toppings={toppings}
        aderezos={aderezos}
        onAgregar={(config) => {
          onAgregarEnsalada(config)
          setModalOpen(false)
        }}
      />
    </div>
  )
}
