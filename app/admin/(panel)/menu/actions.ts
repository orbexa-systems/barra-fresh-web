'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type ProductoUpdate = Database['public']['Tables']['productos']['Update']

const REVALIDATE = () => {
  revalidatePath('/admin/menu')
  revalidatePath('/')
  revalidatePath('/menu')
}

// ─── Productos ───────────────────────────────────────────────

export async function toggleDisponible(id: string, value: boolean) {
  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.from('productos').update({ disponible: value }).eq('id', id)
    if (error) throw error
  } catch (e) {
    console.error('toggleDisponible:', e)
  } finally {
    REVALIDATE()
  }
}

export async function toggleDestacado(id: string, value: boolean) {
  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.from('productos').update({ destacado: value }).eq('id', id)
    if (error) throw error
  } catch (e) {
    console.error('toggleDestacado:', e)
  } finally {
    REVALIDATE()
  }
}

export async function deleteProducto(id: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) throw error
  } catch (e) {
    console.error('deleteProducto:', e)
  } finally {
    REVALIDATE()
  }
}

async function uploadImagen(file: File): Promise<string | null> {
  const supabase = createServiceClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('productos').upload(path, file, { upsert: true })
  if (error) { console.error('Upload error:', error.message); return null }
  const { data } = supabase.storage.from('productos').getPublicUrl(path)
  return data.publicUrl
}

export async function createProducto(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  let imagen_url: string | null = null
  const file = formData.get('imagen') as File | null
  if (file && file.size > 0) imagen_url = await uploadImagen(file)

  const { error } = await supabase.from('productos').insert({
    categoria_id: formData.get('categoria_id') as string,
    nombre: formData.get('nombre') as string,
    descripcion: formData.get('descripcion') as string || null,
    precio: Number(formData.get('precio')),
    imagen_url,
    disponible: formData.get('disponible') === 'on',
    destacado: formData.get('destacado') === 'on',
    orden: Number(formData.get('orden') ?? 0),
  })

  if (error) throw new Error('No se pudo crear el producto. Intenta de nuevo.')
  REVALIDATE()
}

export async function updateProducto(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()

  let imagen_url: string | undefined = undefined
  const file = formData.get('imagen') as File | null
  if (file && file.size > 0) {
    const url = await uploadImagen(file)
    if (url) imagen_url = url
  }

  const update: ProductoUpdate = {
    categoria_id: formData.get('categoria_id') as string,
    nombre: formData.get('nombre') as string,
    descripcion: (formData.get('descripcion') as string) || null,
    precio: Number(formData.get('precio')),
    disponible: formData.get('disponible') === 'on',
    destacado: formData.get('destacado') === 'on',
    orden: Number(formData.get('orden') ?? 0),
    ...(imagen_url ? { imagen_url } : {}),
  }

  const { error } = await supabase.from('productos').update(update).eq('id', id)
  if (error) throw new Error('No se pudo actualizar el producto. Intenta de nuevo.')
  REVALIDATE()
}

// ─── Categorías ──────────────────────────────────────────────

export async function createCategoria(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: last } = await supabase.from('categorias').select('orden').order('orden', { ascending: false }).limit(1).single()
  await supabase.from('categorias').insert({
    nombre: formData.get('nombre') as string,
    orden: (last?.orden ?? 0) + 1,
  })
  REVALIDATE()
}

export async function updateCategoriaNombre(id: string, nombre: string) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('categorias').update({ nombre }).eq('id', id)
  REVALIDATE()
}

export async function toggleCategoriaActiva(id: string, value: boolean) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('categorias').update({ activo: value }).eq('id', id)
  REVALIDATE()
}
