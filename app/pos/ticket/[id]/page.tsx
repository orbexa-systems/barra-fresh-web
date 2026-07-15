import { notFound } from 'next/navigation'
import { getPedidoById } from '@/lib/data/pedidos'
import { TicketActions } from './TicketActions'
import type { Json } from '@/types/database'

function formatMXN(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

function formatFecha(iso: string) {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

type ItemPedido = { nombre: string; descripcion?: string; precio: number; cantidad: number; subtotal: number }

function isItemArray(v: Json): v is ItemPedido[] {
  return Array.isArray(v)
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TicketPage({ params }: PageProps) {
  const { id } = await params
  const pedido = await getPedidoById(id)
  if (!pedido) notFound()

  const items: ItemPedido[] = isItemArray(pedido.items) ? (pedido.items as ItemPedido[]) : []
  const shortId = pedido.id.slice(-8).toUpperCase()

  return (
    <>
      <style>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
          .ticket { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-100 flex items-start justify-center py-8 print:py-0 print:bg-white">
        <div className="ticket w-[320px] bg-white shadow-lg rounded-lg overflow-hidden print:w-full print:rounded-none print:shadow-none">
          <div className="px-6 pt-6 pb-4 text-center border-b border-dashed border-gray-200">
            <div className="text-[22px] font-black text-gray-900 tracking-tight">BarraFresh</div>
            <p className="text-[12px] text-gray-400 mt-0.5">Punto de Venta</p>
            <p className="text-[11px] text-gray-400 mt-3">{formatFecha(pedido.created_at)}</p>
            <p className="text-[13px] font-bold text-gray-700 mt-1">Pedido #{shortId}</p>
            {pedido.nombre_cliente && (
              <p className="text-[12px] text-gray-500 mt-1">{pedido.nombre_cliente}</p>
            )}
          </div>

          <div className="px-6 py-4">
            {items.map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800">
                    {item.cantidad}× {item.nombre}
                  </p>
                  {item.descripcion && (
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.descripcion}</p>
                  )}
                  <p className="text-[11px] text-gray-400">{formatMXN(item.precio)} c/u</p>
                </div>
                <span className="text-[13px] font-bold text-gray-800 tabular-nums shrink-0">
                  {formatMXN(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="px-6 pt-3 pb-4 border-t border-dashed border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-black text-gray-900">TOTAL</span>
              <span className="text-[20px] font-black text-gray-900 tabular-nums">{formatMXN(pedido.total)}</span>
            </div>
            {pedido.notas && (
              <p className="text-[11px] text-gray-400 mt-2 italic">Notas: {pedido.notas}</p>
            )}
          </div>

          <div className="px-6 pb-6 text-center border-t border-dashed border-gray-200 pt-4">
            <p className="text-[11px] text-gray-400">¡Gracias por tu pedido!</p>
            <p className="text-[10px] text-gray-300 mt-1">barrafresh.com</p>
          </div>
        </div>

        <TicketActions />
      </div>
    </>
  )
}
