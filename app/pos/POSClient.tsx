'use client'

import { useState, useCallback } from 'react'
import { Catalogo } from '@/components/pos/Catalogo'
import { ResumenPedido } from '@/components/pos/ResumenPedido'
import { PedidoConfirmado } from '@/components/pos/PedidoConfirmado'
import type { Producto } from '@/lib/data/productos'
import type { Categoria } from '@/lib/data/categorias'
import type { TamanoEnsalada, Topping, Aderezo } from '@/lib/data/configurador'
import { useToast } from '@/components/shared/Toast'

export type CartItem = {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  cantidad: number
}

export type EnsaladaConfig = {
  tamano: TamanoEnsalada
  toppingsBase: Topping[]
  toppingsEspeciales: Topping[]
  aderezo: Aderezo | null
  notas: string
}

interface Props {
  categorias: Categoria[]
  productos: Producto[]
  tamanos: TamanoEnsalada[]
  toppings: Topping[]
  aderezos: Aderezo[]
}

export function POSClient({ categorias, productos, tamanos, toppings, aderezos }: Props) {
  const { showToast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [nombreCliente, setNombreCliente] = useState('')
  const [notas, setNotas] = useState('')
  const [pedidoId, setPedidoId] = useState<string | null>(null)
  const [showMobileResumen, setShowMobileResumen] = useState(false)

  const agregarProducto = useCallback((producto: Producto) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === producto.id)
      if (existing) {
        return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i)
      }
      return [...prev, { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }]
    })
    showToast(`${producto.nombre} agregado al pedido`, 'success')
  }, [showToast])

  const agregarEnsalada = useCallback((config: EnsaladaConfig) => {
    const precioExtra = config.toppingsEspeciales.reduce((sum, t) => sum + t.precio_extra, 0)
    const precio = config.tamano.precio + precioExtra

    const partes = [
      ...config.toppingsBase.map(t => t.nombre),
      ...config.toppingsEspeciales.map(t => `${t.nombre} (+$${t.precio_extra})`),
    ]
    const descripcion = [
      partes.join(', '),
      config.aderezo ? `Aderezo: ${config.aderezo.nombre}` : '',
      config.notas || '',
    ].filter(Boolean).join(' · ')

    const item: CartItem = {
      id: `ensalada-${Date.now()}`,
      nombre: `Ensalada ${config.tamano.nombre}`,
      descripcion,
      precio,
      cantidad: 1,
    }
    setCart(prev => [...prev, item])
    showToast(`Ensalada ${config.tamano.nombre} agregada al pedido`, 'success')
  }, [showToast])

  const cambiarCantidad = useCallback((id: string, delta: number) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id)
      if (!item) return prev
      if (item.cantidad + delta <= 0) return prev.filter(i => i.id !== id)
      return prev.map(i => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i)
    })
  }, [])

  const eliminarItem = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }, [])

  const limpiarCarrito = useCallback(() => {
    setCart([])
    setNombreCliente('')
    setNotas('')
    setPedidoId(null)
    setShowMobileResumen(false)
  }, [])

  if (pedidoId) {
    const total = cart.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
    return (
      <PedidoConfirmado
        pedidoId={pedidoId}
        total={total}
        items={cart}
        nombreCliente={nombreCliente}
        onNuevoPedido={limpiarCarrito}
      />
    )
  }

  const totalUnidades = cart.reduce((s, i) => s + i.cantidad, 0)

  return (
    <div className="relative flex h-full gap-3">
      {/* Catálogo — full width on mobile (hidden when resumen abierto), flex-[3] on tablet+ */}
      <div className={`min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-col flex-[3] ${showMobileResumen ? 'hidden md:flex' : 'flex'}`}>
        <Catalogo
          categorias={categorias}
          productos={productos}
          cart={cart}
          tamanos={tamanos}
          toppings={toppings}
          aderezos={aderezos}
          onAgregarProducto={agregarProducto}
          onAgregarEnsalada={agregarEnsalada}
        />
      </div>

      {/* Resumen — sidebar en tablet+, overlay fullscreen en mobile */}
      <div
        className={`bg-white border border-gray-200 overflow-hidden flex-col
          ${showMobileResumen
            ? 'flex fixed inset-0 z-50 rounded-none md:relative md:inset-auto md:z-auto md:rounded-xl md:w-[380px] md:shrink-0 md:shadow-sm'
            : 'hidden md:flex md:w-[380px] md:shrink-0 md:rounded-xl md:shadow-sm'
          }`}
      >
        {/* Barra de cierre — solo mobile */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0 md:hidden">
          <span className="text-sm font-semibold text-gray-800">Pedido actual</span>
          <button
            onClick={() => setShowMobileResumen(false)}
            aria-label="Cerrar resumen"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ResumenPedido
          cart={cart}
          nombreCliente={nombreCliente}
          notas={notas}
          onCambiarCantidad={cambiarCantidad}
          onEliminarItem={eliminarItem}
          onNombreChange={setNombreCliente}
          onNotasChange={setNotas}
          onLimpiarCarrito={limpiarCarrito}
          onPedidoConfirmado={setPedidoId}
        />
      </div>

      {/* Botón flotante "Ver pedido" — solo mobile, solo cuando catálogo está visible */}
      {!showMobileResumen && (
        <button
          onClick={() => setShowMobileResumen(true)}
          aria-label={`Ver pedido${totalUnidades > 0 ? `, ${totalUnidades} productos` : ''}`}
          className="fixed bottom-6 right-6 z-40 md:hidden flex items-center gap-2.5 px-5 py-3 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-2xl shadow-lg text-sm font-bold transition-colors"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          Ver pedido{totalUnidades > 0 ? ` (${totalUnidades})` : ''}
        </button>
      )}
    </div>
  )
}
