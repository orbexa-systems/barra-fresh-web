'use client'

import { useState } from 'react'
import { ItemPedido } from './ItemPedido'
import { crearPedidoPOS } from '@/app/pos/actions'
import type { CartItem } from '@/app/pos/POSClient'
import type { Json } from '@/types/database'

function formatMXN(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

interface Props {
  cart: CartItem[]
  nombreCliente: string
  notas: string
  onCambiarCantidad: (id: string, delta: number) => void
  onEliminarItem: (id: string) => void
  onNombreChange: (v: string) => void
  onNotasChange: (v: string) => void
  onLimpiarCarrito: () => void
  onPedidoConfirmado: (id: string) => void
}

export function ResumenPedido({
  cart,
  nombreCliente,
  notas,
  onCambiarCantidad,
  onEliminarItem,
  onNombreChange,
  onNotasChange,
  onLimpiarCarrito,
  onPedidoConfirmado,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = cart.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
  const totalUnidades = cart.reduce((s, i) => s + i.cantidad, 0)
  const hasItems = cart.length > 0

  async function confirmarPedido() {
    if (!hasItems || loading) return
    setLoading(true)
    setError(null)
    try {
      const items = cart.map(i => ({
        nombre: i.nombre,
        descripcion: i.descripcion,
        precio: i.precio,
        cantidad: i.cantidad,
        subtotal: i.precio * i.cantidad,
      }))

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 10_000)
      )

      const pedido = await Promise.race([
        crearPedidoPOS({
          origen: 'pos',
          estado: 'confirmado',
          items: items as unknown as Json,
          total,
          nombre_cliente: nombreCliente || null,
          notas: notas || null,
        }),
        timeout,
      ])

      if (!pedido) {
        setError('No se pudo guardar el pedido. Intenta de nuevo.')
        return
      }
      onPedidoConfirmado(pedido.id)
    } catch (e) {
      if (e instanceof Error && e.message === 'timeout') {
        setError('El servidor tardó demasiado. Verifica tu conexión e intenta de nuevo.')
      } else {
        setError('Error al confirmar el pedido. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
        <h2 className="text-[17px] font-bold text-gray-900">Pedido actual</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">
          {hasItems ? `${totalUnidades} producto${totalUnidades !== 1 ? 's' : ''}` : 'Sin ítems aún'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!hasItems ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7 text-gray-300" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-gray-700">Carrito vacío</p>
            <p className="text-[13px] text-gray-400 mt-1">Agrega productos para comenzar</p>
          </div>
        ) : (
          <div className="px-5 pt-2">
            {cart.map(item => (
              <ItemPedido
                key={item.id}
                item={item}
                onCambiarCantidad={onCambiarCantidad}
                onEliminar={onEliminarItem}
              />
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-gray-100">
        <div className="px-5 pt-4 space-y-2.5">
          <input
            type="text"
            value={nombreCliente}
            onChange={e => onNombreChange(e.target.value)}
            placeholder="Nombre del cliente (opcional)"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-shadow"
          />
          <textarea
            value={notas}
            onChange={e => onNotasChange(e.target.value)}
            placeholder="Notas del pedido (opcional)"
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-shadow resize-none"
          />
        </div>

        {hasItems && (
          <div className="px-5 pt-3 pb-1">
            <div className="flex items-center justify-between py-1">
              <span className="text-[13px] text-gray-500">Subtotal</span>
              <span className="text-[13px] text-gray-500">{formatMXN(total)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-100">
              <span className="text-[18px] font-bold text-gray-900">Total</span>
              <span className="text-[22px] font-extrabold text-gray-900 tabular-nums">{formatMXN(total)}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-5 mt-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-100">
            <p className="text-[12px] text-red-600">{error}</p>
          </div>
        )}

        <div className="px-5 pb-5 pt-3 space-y-2">
          <button
            onClick={confirmarPedido}
            disabled={!hasItems || loading}
            className="w-full h-12 rounded-lg bg-brand-primary hover:bg-brand-primary-dark text-white text-[15px] font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Confirmando…
              </>
            ) : 'Confirmar pedido'}
          </button>
          {hasItems && (
            <button
              onClick={onLimpiarCarrito}
              disabled={loading}
              className="w-full py-2 text-[13px] text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
            >
              Cancelar pedido
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
