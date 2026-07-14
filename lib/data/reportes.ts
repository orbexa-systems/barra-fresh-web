import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Json } from '@/types/database'

export type PeriodoReporte = '7d' | '30d' | '90d'

type OrderItem = { nombre?: string; precio?: number; cantidad?: number }

function parseItems(json: Json): OrderItem[] {
  if (!Array.isArray(json)) return []
  return json as OrderItem[]
}

export interface ResumenReporte {
  periodo: PeriodoReporte
  totalVentas: number
  totalPedidos: number
  ticketPromedio: number
  pedidosPorEstado: Record<string, number>
  pedidosPorOrigen: { whatsapp: number; pos: number }
  ventasPorDia: { fecha: string; ventas: number; pedidos: number }[]
  topProductos: { nombre: string; cantidad: number; total: number }[]
}

export async function getReporte(periodo: PeriodoReporte): Promise<ResumenReporte> {
  const supabase = await createServerSupabaseClient()

  const dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90
  const desde = new Date()
  desde.setDate(desde.getDate() - dias)
  desde.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .gte('created_at', desde.toISOString())
    .neq('estado', 'cancelado')
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  const pedidos = data ?? []

  // Totales generales
  const totalVentas = pedidos.reduce((s, p) => s + p.total, 0)
  const totalPedidos = pedidos.length
  const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0

  // Por estado
  const pedidosPorEstado: Record<string, number> = {}
  for (const p of pedidos) {
    pedidosPorEstado[p.estado] = (pedidosPorEstado[p.estado] ?? 0) + 1
  }

  // Por origen
  const pedidosPorOrigen = {
    whatsapp: pedidos.filter(p => p.origen === 'whatsapp').length,
    pos: pedidos.filter(p => p.origen === 'pos').length,
  }

  // Ventas por día
  const ventasPorDiaMap: Record<string, { ventas: number; pedidos: number }> = {}
  // Initialize all days in the period
  for (let i = dias - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    ventasPorDiaMap[key] = { ventas: 0, pedidos: 0 }
  }
  for (const p of pedidos) {
    const key = p.created_at.slice(0, 10)
    if (ventasPorDiaMap[key]) {
      ventasPorDiaMap[key].ventas += p.total
      ventasPorDiaMap[key].pedidos += 1
    }
  }
  const ventasPorDia = Object.entries(ventasPorDiaMap).map(([fecha, v]) => ({ fecha, ...v }))

  // Top productos
  const productosMap: Record<string, { cantidad: number; total: number }> = {}
  for (const p of pedidos) {
    for (const item of parseItems(p.items)) {
      const nombre = item.nombre ?? 'Desconocido'
      const cantidad = item.cantidad ?? 1
      const total = (item.precio ?? 0) * cantidad
      if (!productosMap[nombre]) productosMap[nombre] = { cantidad: 0, total: 0 }
      productosMap[nombre].cantidad += cantidad
      productosMap[nombre].total += total
    }
  }
  const topProductos = Object.entries(productosMap)
    .map(([nombre, v]) => ({ nombre, ...v }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10)

  return {
    periodo,
    totalVentas,
    totalPedidos,
    ticketPromedio,
    pedidosPorEstado,
    pedidosPorOrigen,
    ventasPorDia,
    topProductos,
  }
}
