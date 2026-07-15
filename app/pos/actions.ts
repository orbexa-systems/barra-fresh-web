'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { PedidoInsert, Pedido } from '@/lib/data/pedidos'

export async function crearPedidoPOS(pedido: PedidoInsert): Promise<Pedido | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('pedidos')
    .insert(pedido)
    .select()
    .single()
  if (error) {
    console.error('Error al guardar pedido POS:', error.message)
    return null
  }
  return data
}
