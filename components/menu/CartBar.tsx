'use client'

import { useState } from 'react'
import { useCart } from '@/components/menu/CartContext'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/utils'
import { crearPedidoWhatsapp } from '@/app/actions/pedidos'

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

function buildOrderMessage(items: ReturnType<typeof useCart>['items'], total: number): string {
  const lines = ['Hola BarraFresh 🛒 Quiero ordenar:', '']
  items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name} — ${formatPrice(item.price)}`)
    if (item.detail) {
      item.detail.split('\n').forEach(line => lines.push(`   ${line}`))
    }
  })
  lines.push('', `Total: ${formatPrice(total)}`, '', '¿Está disponible?')
  return lines.join('\n')
}

export function CartBar() {
  const { items, removeItem, clearCart, total } = useCart()
  const [expanded, setExpanded] = useState(false)
  const [sending, setSending] = useState(false)

  if (items.length === 0) return null

  const whatsappUrl = buildWhatsAppUrl(buildOrderMessage(items, total))

  async function handleEnviarPedido() {
    setSending(true)
    try {
      await crearPedidoWhatsapp({
        origen: 'whatsapp',
        estado: 'pendiente',
        items: items as unknown as Parameters<typeof crearPedidoWhatsapp>[0]['items'],
        total,
      })
    } catch {
      // Si falla el guardado, abrimos WhatsApp de todas formas
    } finally {
      setSending(false)
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 shadow-2xl">
      {/* Panel expandible */}
      {expanded && (
        <div className="bg-white border-t border-gray-200 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Tu pedido</span>
            <button
              onClick={clearCart}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Vaciar todo
            </button>
          </div>
          <ul className="divide-y divide-gray-50">
            {items.map(item => (
              <li key={item.cartId} className="flex items-start gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                  {item.detail && (
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      {item.detail.split('\n').join(' · ')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-brand-primary text-sm">{formatPrice(item.price)}</span>
                  <button
                    onClick={() => removeItem(item.cartId)}
                    className="w-5 h-5 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center text-base leading-none transition-colors focus:outline-none"
                    aria-label={`Quitar ${item.name}`}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Barra principal */}
      <div className="bg-brand-primary-dark flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex-1 flex items-center gap-3 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
          aria-expanded={expanded}
        >
          {/* Icono carrito con badge */}
          <div className="relative shrink-0">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {items.length}
            </span>
          </div>

          <div className="text-left min-w-0">
            <p className="text-white font-semibold text-sm">
              {items.length} {items.length === 1 ? 'producto' : 'productos'}
            </p>
            <p className="text-brand-primary-muted text-xs">{expanded ? 'Ocultar ▲' : 'Ver pedido ▼'}</p>
          </div>

          <span className="text-white font-extrabold text-xl ml-auto shrink-0">
            {formatPrice(total)}
          </span>
        </button>

        <button
          onClick={handleEnviarPedido}
          disabled={sending}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-primary-dark font-semibold text-sm hover:bg-brand-surface shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-70 disabled:cursor-wait"
        >
          {WA_ICON}
          <span>{sending ? 'Un momento…' : 'Enviar pedido'}</span>
        </button>
      </div>
    </div>
  )
}
