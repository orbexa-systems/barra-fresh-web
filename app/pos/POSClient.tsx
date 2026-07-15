'use client'

import { useState, useCallback } from 'react'
import { Catalogo } from '@/components/pos/Catalogo'
import { ResumenPedido } from '@/components/pos/ResumenPedido'
import { PedidoConfirmado } from '@/components/pos/PedidoConfirmado'
import type { Producto } from '@/lib/data/productos'
import type { Categoria } from '@/lib/data/categorias'
import type { TamanoEnsalada, Topping, Aderezo } from '@/lib/data/configurador'

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
  const [cart, setCart] = useState<CartItem[]>([])
  const [nombreCliente, setNombreCliente] = useState('')
  const [notas, setNotas] = useState('')
  const [pedidoId, setPedidoId] = useState<string | null>(null)

  const agregarProducto = useCallback((producto: Producto) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === producto.id)
      if (existing) {
        return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i)
      }
      return [...prev, { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }]
    })
  }, [])

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
  }, [])

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

  return (
    <div className="flex h-full gap-3">
      <div className="flex-[3] min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
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
      <div className="w-[380px] shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
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
    </div>
  )
}
