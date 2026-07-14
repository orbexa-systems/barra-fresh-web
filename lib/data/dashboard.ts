import { createServerSupabaseClient } from '@/lib/supabase-server'

export interface DashboardStats {
  pedidosHoy: number
  ventasHoy: number
  pedidosPendientes: number
  topProductos: { nombre: string; cantidad: number }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerSupabaseClient()

  const hoyInicio = new Date()
  hoyInicio.setHours(0, 0, 0, 0)
  const hoyFin = new Date()
  hoyFin.setHours(23, 59, 59, 999)

  const [{ data: pedidosHoy }, { data: pendientes }] = await Promise.all([
    supabase
      .from('pedidos')
      .select('total, items, estado')
      .gte('created_at', hoyInicio.toISOString())
      .lte('created_at', hoyFin.toISOString()),
    supabase
      .from('pedidos')
      .select('id', { count: 'exact' })
      .eq('estado', 'pendiente'),
  ])

  const ventasHoy = (pedidosHoy ?? []).reduce((sum, p) => sum + Number(p.total), 0)

  // Contar frecuencia de productos desde JSONB items
  const conteo: Record<string, number> = {}
  for (const pedido of pedidosHoy ?? []) {
    const items = pedido.items as { name: string }[]
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.name) conteo[item.name] = (conteo[item.name] ?? 0) + 1
      }
    }
  }

  const topProductos = Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))

  return {
    pedidosHoy: pedidosHoy?.length ?? 0,
    ventasHoy,
    pedidosPendientes: pendientes?.length ?? 0,
    topProductos,
  }
}
