'use server'

import { createServiceClient } from '@/lib/supabase'
import type { PedidoInsert, Pedido } from '@/lib/data/pedidos'

export async function crearPedidoWhatsapp(pedido: PedidoInsert): Promise<Pedido | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('pedidos')
    .insert(pedido)
    .select()
    .single()
  if (error) {
    console.error('Error al guardar pedido WhatsApp:', error.message)
    return null
  }
  return data
}
