import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Database } from '@/types/database'

export type Categoria = Database['public']['Tables']['categorias']['Row']

// Caché 1 hora — categorías cambian muy poco
export const getCategorias = unstable_cache(
  async (): Promise<Categoria[]> => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('activo', true)
      .order('orden')
    if (error) throw new Error(error.message)
    return data
  },
  ['categorias'],
  { revalidate: 3600, tags: ['categorias'] }
)

// Admin — usa cliente autenticado, sin caché
export async function getCategoriaById(id: string): Promise<Categoria | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getAllCategoriasAdmin(): Promise<Categoria[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('orden')
  if (error) throw new Error(error.message)
  return data
}
