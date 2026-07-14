'use client'

import { useState } from 'react'
import { PedidosList } from './PedidosList'
import { PedidoDrawer } from './PedidoDrawer'
import type { Pedido, EstadoPedido } from '@/lib/data/pedidos'

type FiltroEstado = EstadoPedido | 'todos'
type FiltroOrigen = 'todos' | 'whatsapp' | 'pos'

const FILTROS_ESTADO: { value: FiltroEstado; label: string }[] = [
  { value: 'todos',      label: 'Todos' },
  { value: 'pendiente',  label: 'Pendiente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'entregado',  label: 'Entregado' },
  { value: 'cancelado',  label: 'Cancelado' },
]

const FILTROS_ORIGEN: { value: FiltroOrigen; label: string }[] = [
  { value: 'todos',     label: 'Todos los canales' },
  { value: 'whatsapp',  label: 'WhatsApp' },
  { value: 'pos',       label: 'POS' },
]

interface Props { pedidos: Pedido[] }

export function PedidosClient({ pedidos }: Props) {
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')
  const [filtroOrigen, setFiltroOrigen] = useState<FiltroOrigen>('todos')
  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null)

  const filtered = pedidos.filter(p => {
    if (filtroEstado !== 'todos' && p.estado !== filtroEstado) return false
    if (filtroOrigen !== 'todos' && p.origen !== filtroOrigen) return false
    return true
  })

  const pendientes = pedidos.filter(p => p.estado === 'pendiente').length

  return (
    <>
      {/* Page header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pedidos.length} pedidos en total
            {pendientes > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-700 font-semibold">
                · {pendientes} pendiente{pendientes > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Filtro por estado */}
        <div className="flex items-center gap-2 flex-wrap">
          {FILTROS_ESTADO.map(f => {
            const count = f.value === 'todos'
              ? pedidos.length
              : pedidos.filter(p => p.estado === f.value).length
            return (
              <button
                key={f.value}
                onClick={() => setFiltroEstado(f.value)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  filtroEstado === f.value
                    ? 'bg-brand-surface border-brand-primary text-brand-primary-dark'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {f.label}
                <span className={`text-[11px] font-bold tabular-nums ${
                  filtroEstado === f.value ? 'text-brand-primary' : 'text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Filtro por origen */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {FILTROS_ORIGEN.map(f => (
            <button
              key={f.value}
              onClick={() => setFiltroOrigen(f.value)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ${
                filtroOrigen === f.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resultado filtros */}
      {filtered.length !== pedidos.length && (
        <p className="text-xs text-gray-400 mb-3">
          Mostrando {filtered.length} de {pedidos.length} pedidos
        </p>
      )}

      <PedidosList pedidos={filtered} onVerDetalle={setPedidoDetalle} />

      <PedidoDrawer
        pedido={pedidoDetalle}
        onClose={() => setPedidoDetalle(null)}
      />
    </>
  )
}
