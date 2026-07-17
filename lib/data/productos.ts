import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Database } from '@/types/database'

export type Producto = Database['public']['Tables']['productos']['Row']

// Caché 5 minutos — disponibilidad puede cambiar con frecuencia
export const getProductos = unstable_cache(
  async (): Promise<Producto[]> => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('disponible', true)
      .order('orden')
    if (error) throw new Error(error.message)
    return data
  },
  ['productos'],
  { revalidate: 300, tags: ['productos'] }
)

export const getProductosDestacados = unstable_cache(
  async (): Promise<Producto[]> => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('destacado', true)
      .eq('disponible', true)
      .order('orden')
    if (error) throw new Error(error.message)
    return data
  },
  ['productos-destacados'],
  { revalidate: 300, tags: ['productos'] }
)

export const getProductosByCategoria = unstable_cache(
  async (categoriaId: string): Promise<Producto[]> => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('categoria_id', categoriaId)
      .eq('disponible', true)
      .order('orden')
    if (error) throw new Error(error.message)
    return data
  },
  ['productos-categoria'],
  { revalidate: 300, tags: ['productos'] }
)

// Admin — usa cliente autenticado, sin caché (necesita ver productos inactivos)
export async function getProductoById(id: string): Promise<Producto | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getAllProductosAdmin(): Promise<Producto[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('orden')
  if (error) throw new Error(error.message)
  return data
}
