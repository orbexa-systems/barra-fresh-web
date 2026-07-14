import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Database } from '@/types/database'

export type Categoria = Database['public']['Tables']['categorias']['Row']

export async function getCategorias(): Promise<Categoria[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('activo', true)
    .order('orden')
  if (error) throw new Error(error.message)
  return data
}

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
