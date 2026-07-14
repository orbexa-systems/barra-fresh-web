import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Database } from '@/types/database'

export type TamanoEnsalada = Database['public']['Tables']['tamanos_ensalada']['Row']
export type Topping = Database['public']['Tables']['toppings']['Row']
export type Aderezo = Database['public']['Tables']['aderezos']['Row']

export async function getTamanos(): Promise<TamanoEnsalada[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tamanos_ensalada')
    .select('*')
    .eq('activo', true)
    .order('orden')
  if (error) throw new Error(error.message)
  return data
}

export async function getToppings(): Promise<Topping[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('toppings')
    .select('*')
    .eq('disponible', true)
    .order('orden')
  if (error) throw new Error(error.message)
  return data
}

export async function getAderezos(): Promise<Aderezo[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('aderezos')
    .select('*')
    .eq('disponible', true)
    .order('orden')
  if (error) throw new Error(error.message)
  return data
}
