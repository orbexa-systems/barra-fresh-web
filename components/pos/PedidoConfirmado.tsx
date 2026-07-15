'use client'

import Link from 'next/link'
import type { CartItem } from '@/app/pos/POSClient'

function formatMXN(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

interface Props {
  pedidoId: string
  total: number
  items: CartItem[]
  nombreCliente: string
  onNuevoPedido: () => void
}

export function PedidoConfirmado({ pedidoId, total, items, nombreCliente, onNuevoPedido }: Props) {
  const shortId = pedidoId.slice(-8).toUpperCase()

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-brand-primary px-8 pt-8 pb-6 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-9 h-9" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
            </svg>
          </div>
          <h2 className="text-[22px] font-extrabold text-white">¡Pedido confirmado!</h2>
          {nombreCliente && (
            <p className="text-white/80 text-[14px] mt-1">{nombreCliente}</p>
          )}
          <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 rounded-full px-4 py-1.5">
            <span className="text-white/70 text-[12px]">Pedido</span>
            <span className="text-white font-bold text-[13px] tracking-wider">#{shortId}</span>
          </div>
        </div>

        <div className="px-8 py-5">
          <div className="space-y-2 mb-5">
            {items.map(item => (
              <div key={item.id} className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] text-gray-700 font-medium">
                    {item.cantidad > 1 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-surface text-brand-primary-dark text-[11px] font-bold mr-1.5">
                        {item.cantidad}
                      </span>
                    )}
                    {item.nombre}
                  </span>
                  {item.descripcion && (
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{item.descripcion}</p>
                  )}
                </div>
                <span className="text-[13px] text-gray-700 font-semibold tabular-nums shrink-0">
                  {formatMXN(item.precio * item.cantidad)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-[15px] font-bold text-gray-900">Total</span>
            <span className="text-[20px] font-extrabold text-gray-900 tabular-nums">{formatMXN(total)}</span>
          </div>
        </div>

        <div className="px-8 pb-8 flex gap-3">
          <Link
            href={`/pos/ticket/${pedidoId}`}
            target="_blank"
            className="flex-1 h-11 rounded-lg border border-gray-200 text-gray-700 text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400" aria-hidden="true">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9h8v2H6v-2zm-1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
            </svg>
            Ver ticket
          </Link>
          <button
            onClick={onNuevoPedido}
            className="flex-1 h-11 rounded-lg bg-brand-primary text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-brand-primary-dark transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Nuevo pedido
          </button>
        </div>
      </div>
    </div>
  )
}
