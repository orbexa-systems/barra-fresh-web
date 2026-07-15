'use client'

import type { CartItem } from '@/app/pos/POSClient'

function formatMXN(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

interface Props {
  item: CartItem
  onCambiarCantidad: (id: string, delta: number) => void
  onEliminar: (id: string) => void
}

export function ItemPedido({ item, onCambiarCantidad, onEliminar }: Props) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-gray-900 leading-tight">{item.nombre}</p>
        {item.descripcion && (
          <p className="text-[11px] text-gray-400 mt-0.5 leading-tight line-clamp-2">{item.descripcion}</p>
        )}
        <p className="text-[12px] text-gray-400 mt-1">{formatMXN(item.precio)} c/u</p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onCambiarCantidad(item.id, -1)}
          className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-colors"
          aria-label="Reducir cantidad"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
          </svg>
        </button>
        <span className="w-6 text-center text-[14px] font-bold text-gray-900 tabular-nums">{item.cantidad}</span>
        <button
          onClick={() => onCambiarCantidad(item.id, 1)}
          className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-colors"
          aria-label="Aumentar cantidad"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[14px] font-bold text-gray-900 w-14 text-right tabular-nums">
          {formatMXN(item.precio * item.cantidad)}
        </span>
        <button
          onClick={() => onEliminar(item.id)}
          className="w-6 h-6 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors"
          aria-label={`Eliminar ${item.nombre}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
