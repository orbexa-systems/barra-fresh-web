import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Database } from '@/types/database'

export type Pedido = Database['public']['Tables']['pedidos']['Row']
export type PedidoInsert = Database['public']['Tables']['pedidos']['Insert']
export type EstadoPedido = 'pendiente' | 'confirmado' | 'entregado' | 'cancelado'

export async function getPedidos(): Promise<Pedido[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function getPedidoById(id: string): Promise<Pedido | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function updateEstadoPedido(id: string, estado: EstadoPedido): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('pedidos')
    .update({ estado })
    .eq('id', id)
  return !error
}
