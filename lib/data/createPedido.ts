import { createBrowserSupabaseClient } from '@/lib/supabase'
import type { PedidoInsert, Pedido } from '@/lib/data/pedidos'

export async function createPedido(pedido: PedidoInsert): Promise<Pedido | null> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('pedidos')
    .insert(pedido)
    .select()
    .single()
  if (error) {
    console.error('Error al guardar pedido:', error.message)
    return null
  }
  return data
}
