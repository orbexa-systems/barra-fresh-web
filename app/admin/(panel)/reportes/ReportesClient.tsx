'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { ResumenReporte, PeriodoReporte } from '@/lib/data/reportes'

const PERIODOS: { value: PeriodoReporte; label: string }[] = [
  { value: '7d',  label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
]

const ESTADO_COLOR: Record<string, string> = {
  pendiente:  'bg-amber-400',
  confirmado: 'bg-blue-400',
  entregado:  'bg-brand-primary',
  cancelado:  'bg-gray-300',
}

function formatMXN(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

function formatDia(iso: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(new Date(iso + 'T12:00:00'))
}

interface Props {
  reporte: ResumenReporte
  periodo: PeriodoReporte
}

export function ReportesClient({ reporte, periodo }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function cambiarPeriodo(p: PeriodoReporte) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('periodo', p)
    router.push(`/admin/reportes?${params.toString()}`)
  }

  // Chart bars — ventas
  const maxVentas = Math.max(...reporte.ventasPorDia.map(d => d.ventas), 1)

  // Distribución por estado
  const totalPorEstado = Object.values(reporte.pedidosPorEstado).reduce((a, b) => a + b, 0) || 1

  return (
    <>
      {/* Page header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Reportes</h1>
          <p className="text-sm text-gray-500 mt-1">Ventas y estadísticas — pedidos no cancelados</p>
        </div>
        {/* Selector de período */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {PERIODOS.map(p => (
            <button
              key={p.value}
              onClick={() => cambiarPeriodo(p.value)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ${
                periodo === p.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Ventas totales</p>
          <p className="text-[32px] font-extrabold text-brand-primary leading-none">{formatMXN(reporte.totalVentas)}</p>
          <p className="text-xs text-gray-400 mt-1">{reporte.totalPedidos} pedidos en el período</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Ticket promedio</p>
          <p className="text-[32px] font-extrabold text-gray-900 leading-none">{formatMXN(reporte.ticketPromedio)}</p>
          <p className="text-xs text-gray-400 mt-1">Por pedido</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Canal principal</p>
          <p className="text-[32px] font-extrabold text-gray-900 leading-none capitalize">
            {reporte.pedidosPorOrigen.whatsapp >= reporte.pedidosPorOrigen.pos ? 'WhatsApp' : 'POS'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            WA: {reporte.pedidosPorOrigen.whatsapp} · POS: {reporte.pedidosPorOrigen.pos}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Gráfica de barras — ventas por día */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-900">Ventas por día</h2>
            <p className="text-sm text-gray-500 mt-0.5">Ingresos diarios en el período seleccionado</p>
          </div>
          <div className="px-6 py-6">
            {reporte.ventasPorDia.every(d => d.ventas === 0) ? (
              <div className="flex items-center justify-center h-32 text-sm text-gray-400">
                Sin ventas en este período
              </div>
            ) : (
              <div className="flex items-end gap-1 h-40">
                {reporte.ventasPorDia.map(d => {
                  const pct = maxVentas > 0 ? (d.ventas / maxVentas) * 100 : 0
                  return (
                    <div key={d.fecha} className="flex-1 flex flex-col items-center gap-1 group min-w-0">
                      <div className="relative w-full flex flex-col justify-end" style={{ height: '120px' }}>
                        {/* Tooltip */}
                        {d.ventas > 0 && (
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {formatMXN(d.ventas)}
                            <br />
                            <span className="font-normal text-gray-400">{d.pedidos} pedido{d.pedidos !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                        <div
                          className={`w-full rounded-t-md transition-all ${
                            d.ventas > 0 ? 'bg-brand-primary hover:bg-brand-primary-dark' : 'bg-gray-100'
                          }`}
                          style={{ height: `${Math.max(pct, d.ventas > 0 ? 4 : 0)}%` }}
                        />
                      </div>
                      {/* Label fecha — solo si hay pocos días */}
                      {reporte.ventasPorDia.length <= 14 && (
                        <span className="text-[9px] text-gray-400 truncate w-full text-center">
                          {formatDia(d.fecha)}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Distribución por estado */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-900">Por estado</h2>
            <p className="text-sm text-gray-500 mt-0.5">Distribución de pedidos</p>
          </div>
          <div className="px-6 py-5 space-y-3">
            {Object.entries(reporte.pedidosPorEstado).length === 0 ? (
              <p className="text-sm text-gray-400">Sin datos</p>
            ) : (
              Object.entries(reporte.pedidosPorEstado)
                .sort((a, b) => b[1] - a[1])
                .map(([estado, count]) => {
                  const pct = Math.round((count / totalPorEstado) * 100)
                  return (
                    <div key={estado}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">{estado}</span>
                        <span className="text-sm font-semibold text-gray-900">{count} <span className="text-xs text-gray-400 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${ESTADO_COLOR[estado] ?? 'bg-gray-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })
            )}
          </div>
        </div>
      </div>

      {/* Top productos */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-[15px] font-semibold text-gray-900">Productos más vendidos</h2>
          <p className="text-sm text-gray-500 mt-0.5">Top 10 por unidades vendidas en el período</p>
        </div>

        {reporte.topProductos.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-400">
            Sin datos de productos en este período.
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
              <span className="w-8 shrink-0" />
              <span className="flex-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Producto</span>
              <span className="w-24 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center shrink-0">Unidades</span>
              <span className="w-28 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right shrink-0">Total generado</span>
            </div>
            <ul className="divide-y divide-gray-100">
              {reporte.topProductos.map((p, i) => {
                const maxCantidad = reporte.topProductos[0]?.cantidad ?? 1
                const pct = Math.round((p.cantidad / maxCantidad) * 100)
                return (
                  <li key={p.nombre} className="flex items-center gap-4 px-6 py-4 min-h-[64px] hover:bg-gray-50 transition-colors">
                    <span className="w-8 h-8 rounded-full bg-brand-surface text-brand-primary-dark text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-gray-900 truncate">{p.nombre}</p>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mt-1.5 max-w-[200px]">
                        <div className="h-full rounded-full bg-brand-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="w-24 text-[15px] font-semibold text-gray-900 text-center shrink-0">
                      {p.cantidad}×
                    </span>
                    <span className="w-28 text-sm font-semibold text-gray-700 text-right shrink-0">
                      {formatMXN(p.total)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
