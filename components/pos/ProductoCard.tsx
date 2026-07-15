'use client'

import Image from 'next/image'
import type { Producto } from '@/lib/data/productos'
import type { CartItem } from '@/app/pos/POSClient'

function formatMXN(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

interface Props {
  producto: Producto
  cartItem?: CartItem
  onAgregar: (producto: Producto) => void
}

export function ProductoCard({ producto, cartItem, onAgregar }: Props) {
  const noDisponible = !producto.disponible

  return (
    <div className={`relative bg-white rounded-xl border flex flex-col gap-2.5 p-3 transition-all ${
      noDisponible
        ? 'border-gray-100 opacity-50'
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}>
      {cartItem && cartItem.cantidad > 0 && (
        <span className="absolute top-2 left-2 z-10 w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
          {cartItem.cantidad}
        </span>
      )}

      <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
              <rect width="40" height="40" rx="8" fill="#F3F4F6"/>
              <path d="M12 28l7-9 5 6 3-4 7 7H6" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-gray-900 leading-tight line-clamp-2">{producto.nombre}</p>
        <p className="text-[15px] font-bold text-brand-primary mt-1">{formatMXN(producto.precio)}</p>
      </div>

      {noDisponible ? (
        <div className="py-1.5 text-center">
          <span className="text-[11px] text-gray-400 font-medium">No disponible</span>
        </div>
      ) : (
        <button
          onClick={() => onAgregar(producto)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary-dark text-white text-[13px] font-semibold transition-colors"
          aria-label={`Agregar ${producto.nombre}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
          </svg>
          Agregar
        </button>
      )}
    </div>
  )
}
