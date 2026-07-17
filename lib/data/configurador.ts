import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Database } from '@/types/database'

export type TamanoEnsalada = Database['public']['Tables']['tamanos_ensalada']['Row']
export type Topping = Database['public']['Tables']['toppings']['Row']
export type Aderezo = Database['public']['Tables']['aderezos']['Row']

// Caché 1 hora — tamaños, toppings y aderezos cambian raramente
export const getTamanos = unstable_cache(
  async (): Promise<TamanoEnsalada[]> => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('tamanos_ensalada')
      .select('*')
      .eq('activo', true)
      .order('orden')
    if (error) throw new Error(error.message)
    return data
  },
  ['tamanos'],
  { revalidate: 3600, tags: ['configurador'] }
)

export const getToppings = unstable_cache(
  async (): Promise<Topping[]> => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('toppings')
      .select('*')
      .eq('disponible', true)
      .order('orden')
    if (error) throw new Error(error.message)
    return data
  },
  ['toppings'],
  { revalidate: 3600, tags: ['configurador'] }
)

export const getAderezos = unstable_cache(
  async (): Promise<Aderezo[]> => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('aderezos')
      .select('*')
      .eq('disponible', true)
      .order('orden')
    if (error) throw new Error(error.message)
    return data
  },
  ['aderezos'],
  { revalidate: 3600, tags: ['configurador'] }
)

// Carga los 3 datos del configurador en paralelo (para /menu y /pos)
export async function getConfiguradorData() {
  const [tamanos, toppings, aderezos] = await Promise.all([
    getTamanos(),
    getToppings(),
    getAderezos(),
  ])
  return { tamanos, toppings, aderezos }
}

// Admin — usa cliente autenticado, sin caché (necesita ver inactivos/no disponibles)
export async function getAllTamanosAdmin(): Promise<TamanoEnsalada[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from('tamanos_ensalada').select('*').order('orden')
  if (error) throw new Error(error.message)
  return data
}

export async function getAllToppingsAdmin(): Promise<Topping[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from('toppings').select('*').order('orden')
  if (error) throw new Error(error.message)
  return data
}

export async function getAllAderezosAdmin(): Promise<Aderezo[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from('aderezos').select('*').order('orden')
  if (error) throw new Error(error.message)
  return data
}
