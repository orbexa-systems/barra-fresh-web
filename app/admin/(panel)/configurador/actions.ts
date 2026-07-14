'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const REVALIDATE = () => revalidatePath('/admin/configurador')

// ─── Tamaños ─────────────────────────────────────────────────

export async function createTamano(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: last } = await supabase
    .from('tamanos_ensalada').select('orden').order('orden', { ascending: false }).limit(1).single()
  await supabase.from('tamanos_ensalada').insert({
    nombre: formData.get('nombre') as string,
    precio: Number(formData.get('precio')),
    max_toppings: Number(formData.get('max_toppings') ?? 5),
    orden: (last?.orden ?? 0) + 1,
  })
  REVALIDATE()
}

export async function updateTamano(id: string, fields: { nombre?: string; precio?: number; max_toppings?: number }) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('tamanos_ensalada').update(fields).eq('id', id)
  REVALIDATE()
}

export async function toggleTamanoActivo(id: string, value: boolean) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('tamanos_ensalada').update({ activo: value }).eq('id', id)
  REVALIDATE()
}

export async function deleteTamano(id: string) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('tamanos_ensalada').delete().eq('id', id)
  REVALIDATE()
}

// ─── Toppings ────────────────────────────────────────────────

export async function createTopping(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const tipo = formData.get('tipo') as 'base' | 'especial'
  const { data: last } = await supabase
    .from('toppings').select('orden').eq('tipo', tipo).order('orden', { ascending: false }).limit(1).single()
  await supabase.from('toppings').insert({
    nombre: formData.get('nombre') as string,
    tipo,
    precio_extra: Number(formData.get('precio_extra') ?? 0),
    orden: (last?.orden ?? 0) + 1,
  })
  REVALIDATE()
}

export async function updateTopping(id: string, fields: { nombre?: string; precio_extra?: number }) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('toppings').update(fields).eq('id', id)
  REVALIDATE()
}

export async function toggleToppingDisponible(id: string, value: boolean) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('toppings').update({ disponible: value }).eq('id', id)
  REVALIDATE()
}

export async function deleteTopping(id: string) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('toppings').delete().eq('id', id)
  REVALIDATE()
}

// ─── Aderezos ────────────────────────────────────────────────

export async function createAderezo(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: last } = await supabase
    .from('aderezos').select('orden').order('orden', { ascending: false }).limit(1).single()
  await supabase.from('aderezos').insert({
    nombre: formData.get('nombre') as string,
    orden: (last?.orden ?? 0) + 1,
  })
  REVALIDATE()
}

export async function updateAderezo(id: string, nombre: string) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('aderezos').update({ nombre }).eq('id', id)
  REVALIDATE()
}

export async function toggleAderezoDisponible(id: string, value: boolean) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('aderezos').update({ disponible: value }).eq('id', id)
  REVALIDATE()
}

export async function deleteAderezo(id: string) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('aderezos').delete().eq('id', id)
  REVALIDATE()
}
