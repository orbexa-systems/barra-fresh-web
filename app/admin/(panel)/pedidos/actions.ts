'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { EstadoPedido } from '@/lib/data/pedidos'

export async function cambiarEstadoPedido(
  id: string,
  estado: EstadoPedido
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.from('pedidos').update({ estado }).eq('id', id)
    if (error) throw error
    revalidatePath('/admin/pedidos')
    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    console.error('cambiarEstadoPedido:', e)
    return { success: false, error: 'No se pudo actualizar el estado del pedido.' }
  }
}
