'use client'

import type { Pedido, EstadoPedido } from '@/lib/data/pedidos'

const ESTADO_STYLE: Record<EstadoPedido, string> = {
  pendiente:  'bg-amber-50 text-amber-700 border-amber-200',
  confirmado: 'bg-blue-50 text-blue-700 border-blue-200',
  entregado:  'bg-brand-surface text-brand-primary-dark border-brand-surface-mid',
  cancelado:  'bg-gray-100 text-gray-500 border-gray-200',
}

const ESTADO_LABEL: Record<EstadoPedido, string> = {
  pendiente:  'Pendiente',
  confirmado: 'Confirmado',
  entregado:  'Entregado',
  cancelado:  'Cancelado',
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

function formatMXN(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
}

function itemCount(items: unknown): string {
  if (!Array.isArray(items)) return '—'
  const total = items.reduce((acc: number, i: unknown) => {
    const item = i as { cantidad?: number }
    return acc + (item?.cantidad ?? 1)
  }, 0)
  return `${total} ${total === 1 ? 'producto' : 'productos'}`
}

interface Props {
  pedidos: Pedido[]
  onVerDetalle: (p: Pedido) => void
}

export function PedidosList({ pedidos, onVerDetalle }: Props) {
  if (pedidos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-[15px] font-medium text-gray-600 mb-1">No hay pedidos en este filtro</p>
        <p className="text-sm text-gray-400">Prueba seleccionando otro estado o canal.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Column headers */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
        <span className="w-24 text-[11px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">Pedido</span>
        <span className="w-36 text-[11px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">Fecha</span>
        <span className="flex-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Cliente</span>
        <span className="w-24 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center shrink-0">Canal</span>
        <span className="w-24 text-[11px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">Productos</span>
        <span className="w-24 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right shrink-0">Total</span>
        <span className="w-28 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center shrink-0">Estado</span>
        <span className="w-10 shrink-0" />
      </div>

      <ul className="divide-y divide-gray-100">
        {pedidos.map(p => (
          <li
            key={p.id}
            className="flex items-center gap-4 px-6 py-4 min-h-[68px] hover:bg-gray-50 transition-colors"
          >
            {/* ID */}
            <span className="w-24 font-mono text-xs font-semibold text-gray-500 shrink-0 truncate">
              #{p.id.slice(0, 8).toUpperCase()}
            </span>

            {/* Fecha */}
            <span className="w-36 text-sm text-gray-600 shrink-0 capitalize">
              {formatTime(p.created_at)}
            </span>

            {/* Cliente */}
            <span className="flex-1 text-sm font-medium text-gray-800 truncate min-w-0">
              {p.nombre_cliente || <span className="text-gray-400 font-normal italic">Sin nombre</span>}
            </span>

            {/* Origen */}
            <div className="w-24 flex justify-center shrink-0">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                p.origen === 'whatsapp'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {p.origen === 'whatsapp' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.124 1.524 5.864L0 24l6.336-1.524A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.653-.51-5.17-1.395l-.37-.22-3.762.906.948-3.658-.24-.382A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 shrink-0"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/></svg>
                )}
                {p.origen === 'whatsapp' ? 'WhatsApp' : 'POS'}
              </span>
            </div>

            {/* Productos */}
            <span className="w-24 text-sm text-gray-600 shrink-0">{itemCount(p.items)}</span>

            {/* Total */}
            <span className="w-24 text-sm font-semibold text-gray-900 text-right shrink-0">
              {formatMXN(p.total)}
            </span>

            {/* Estado */}
            <div className="w-28 flex justify-center shrink-0">
              <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full border ${ESTADO_STYLE[p.estado]}`}>
                {ESTADO_LABEL[p.estado]}
              </span>
            </div>

            {/* Ver detalle */}
            <div className="w-10 flex justify-end shrink-0">
              <button
                onClick={() => onVerDetalle(p)}
                title="Ver detalle del pedido"
                className="p-2 rounded-lg text-gray-400 hover:text-brand-primary hover:bg-brand-surface transition-colors"
              >
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
