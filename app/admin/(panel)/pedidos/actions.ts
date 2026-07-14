'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { EstadoPedido } from '@/lib/data/pedidos'

export async function cambiarEstadoPedido(id: string, estado: EstadoPedido) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('pedidos').update({ estado }).eq('id', id)
  revalidatePath('/admin/pedidos')
  revalidatePath('/admin')
}
