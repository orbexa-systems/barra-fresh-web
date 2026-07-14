'use client'

import { useEffect, useTransition } from 'react'
import { cambiarEstadoPedido } from './actions'
import type { Pedido, EstadoPedido } from '@/lib/data/pedidos'
import type { Json } from '@/types/database'

const ESTADOS: { value: EstadoPedido; label: string; color: string; bg: string }[] = [
  { value: 'pendiente',  label: 'Pendiente',  color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200 hover:bg-amber-100' },
  { value: 'confirmado', label: 'Confirmado', color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
  { value: 'entregado',  label: 'Entregado',  color: 'text-brand-primary-dark', bg: 'bg-brand-surface border-brand-surface-mid hover:bg-brand-surface-mid' },
  { value: 'cancelado',  label: 'Cancelado',  color: 'text-gray-500',   bg: 'bg-gray-50 border-gray-200 hover:bg-gray-100' },
]

type OrderItem = { nombre?: string; precio?: number; cantidad?: number }

function parseItems(json: Json): OrderItem[] {
  if (!Array.isArray(json)) return []
  return json as OrderItem[]
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

function formatMXN(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
}

interface Props {
  pedido: Pedido | null
  onClose: () => void
}

export function PedidoDrawer({ pedido, onClose }: Props) {
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (pedido) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pedido, onClose])

  if (!pedido) return null

  const items = parseItems(pedido.items)
  const estadoActual = ESTADOS.find(e => e.value === pedido.estado)

  function handleEstado(estado: EstadoPedido) {
    if (estado === pedido!.estado) return
    startTransition(() => cambiarEstadoPedido(pedido!.id, estado))
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

      <div
        className="relative z-10 w-full max-w-[480px] bg-white h-full flex flex-col shadow-2xl overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pedido-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0 sticky top-0 bg-white z-10">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Pedido</p>
            <h2 id="pedido-drawer-title" className="text-[15px] font-semibold text-gray-900 font-mono">
              #{pedido.id.slice(0, 8).toUpperCase()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">

          {/* Meta */}
          <section className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Fecha</p>
              <p className="text-sm text-gray-700 capitalize">{formatDate(pedido.created_at)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Canal</p>
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full ${
                pedido.origen === 'whatsapp'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {pedido.origen === 'whatsapp' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.124 1.524 5.864L0 24l6.336-1.524A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.653-.51-5.17-1.395l-.37-.22-3.762.906.948-3.658-.24-.382A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/></svg>
                )}
                {pedido.origen === 'whatsapp' ? 'WhatsApp' : 'POS'}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Cliente</p>
              <p className="text-sm text-gray-700">{pedido.nombre_cliente || <span className="text-gray-400 italic">Sin nombre</span>}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Total</p>
              <p className="text-[18px] font-bold text-gray-900">{formatMXN(pedido.total)}</p>
            </div>
          </section>

          {/* Items */}
          <section>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Productos</p>
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Sin detalle de productos.</p>
            ) : (
              <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                {items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-brand-surface text-brand-primary-dark text-xs font-bold flex items-center justify-center shrink-0">
                        {item.cantidad ?? 1}×
                      </span>
                      <span className="text-sm font-medium text-gray-800">{item.nombre ?? '—'}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {item.precio != null ? formatMXN((item.precio) * (item.cantidad ?? 1)) : '—'}
                    </span>
                  </li>
                ))}
                <li className="flex items-center justify-between px-4 py-3 bg-gray-50">
                  <span className="text-sm font-semibold text-gray-700">Total</span>
                  <span className="text-sm font-bold text-gray-900">{formatMXN(pedido.total)}</span>
                </li>
              </ul>
            )}
          </section>

          {/* Notas */}
          {pedido.notas && (
            <section>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Notas</p>
              <p className="text-sm text-gray-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                {pedido.notas}
              </p>
            </section>
          )}

          {/* Estado */}
          <section>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Estado del pedido
              {pending && <span className="ml-2 text-[10px] text-gray-400 normal-case font-normal">Actualizando…</span>}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ESTADOS.map(e => (
                <button
                  key={e.value}
                  onClick={() => handleEstado(e.value)}
                  disabled={pending}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors disabled:opacity-60 ${
                    pedido.estado === e.value
                      ? `${e.bg} ${e.color} ring-2 ring-offset-1 ring-current`
                      : `${e.bg} ${e.color} opacity-60`
                  }`}
                >
                  {pedido.estado === e.value && (
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                  {e.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
