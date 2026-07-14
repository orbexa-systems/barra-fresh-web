'use client'

import { useActionState, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Categoria } from '@/lib/data/categorias'
import type { Producto } from '@/lib/data/productos'

interface Props {
  categorias: Categoria[]
  producto?: Producto
  action: (formData: FormData) => Promise<void>
}

type State = { error: string | null }

export function ProductForm({ categorias, producto, action }: Props) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      try {
        await action(formData)
        return { error: null }
      } catch (e) {
        return { error: e instanceof Error ? e.message : 'Error al guardar el producto.' }
      }
    },
    { error: null }
  )

  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(producto?.imagen_url ?? null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setPreview(URL.createObjectURL(f))
  }

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            name="nombre"
            required
            defaultValue={producto?.nombre}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light"
            placeholder="Ej. Verde Detox"
          />
        </div>

        {/* Descripción */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            name="descripcion"
            rows={3}
            defaultValue={producto?.descripcion ?? ''}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light resize-none"
            placeholder="Ingredientes o descripción breve"
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio (MXN) *</label>
          <input
            name="precio"
            type="number"
            required
            min={0}
            step={0.01}
            defaultValue={producto?.precio}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light"
            placeholder="65.00"
          />
        </div>

        {/* Orden */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
          <input
            name="orden"
            type="number"
            min={0}
            defaultValue={producto?.orden ?? 0}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light"
          />
        </div>

        {/* Categoría */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
          <select
            name="categoria_id"
            required
            defaultValue={producto?.categoria_id}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light bg-white"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        {/* Imagen */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
          <div className="flex items-start gap-4">
            {preview && (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                <Image src={preview} alt="Preview" fill className="object-cover" unoptimized={preview.startsWith('blob:')} />
              </div>
            )}
            <div className="flex-1">
              <input
                ref={fileRef}
                name="imagen"
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-surface file:text-brand-primary-dark hover:file:bg-brand-surface-mid cursor-pointer"
              />
              <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP. Máx 2MB.</p>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-3">
          <input
            name="disponible"
            type="checkbox"
            id="disponible"
            defaultChecked={producto ? producto.disponible : true}
            className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary-light"
          />
          <label htmlFor="disponible" className="text-sm font-medium text-gray-700">Disponible en el menú</label>
        </div>

        <div className="flex items-center gap-3">
          <input
            name="destacado"
            type="checkbox"
            id="destacado"
            defaultChecked={producto?.destacado ?? false}
            className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary-light"
          />
          <label htmlFor="destacado" className="text-sm font-medium text-gray-700">Destacado en el landing</label>
        </div>
      </div>

      {state.error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {pending ? 'Guardando…' : producto ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <Link
          href="/admin/menu"
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}
