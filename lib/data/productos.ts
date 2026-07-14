import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Database } from '@/types/database'

export type Producto = Database['public']['Tables']['productos']['Row']

export async function getProductos(): Promise<Producto[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('disponible', true)
    .order('orden')
  if (error) throw new Error(error.message)
  return data
}

export async function getProductosByCategoria(categoriaId: string): Promise<Producto[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('categoria_id', categoriaId)
    .eq('disponible', true)
    .order('orden')
  if (error) throw new Error(error.message)
  return data
}

export async function getProductosDestacados(): Promise<Producto[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('destacado', true)
    .eq('disponible', true)
    .order('orden')
  if (error) throw new Error(error.message)
  return data
}

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
