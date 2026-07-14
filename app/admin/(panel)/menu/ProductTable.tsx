'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ToggleSwitch } from '@/components/admin/ToggleSwitch'
import { toggleDisponible, toggleDestacado, deleteProducto } from './actions'
import type { Producto } from '@/lib/data/productos'
import type { Categoria } from '@/lib/data/categorias'

// Paleta de colores para badges de categoría — rota entre 6 tonos
const CAT_COLORS = [
  'bg-emerald-50 text-emerald-700',
  'bg-sky-50 text-sky-700',
  'bg-violet-50 text-violet-700',
  'bg-amber-50 text-amber-700',
  'bg-rose-50 text-rose-700',
  'bg-teal-50 text-teal-700',
]

interface Props {
  productos: Producto[]
  categorias: Categoria[]
}

function DeleteButton({ id }: { id: string }) {
  const [pending, start] = useTransition()
  return (
    <button
      onClick={() => {
        if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
        start(() => deleteProducto(id))
      }}
      disabled={pending}
      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
      title="Eliminar"
    >
      {pending ? (
        <span className="block w-4 h-4 text-xs leading-4 text-center">…</span>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  )
}

export function ProductTable({ productos, categorias }: Props) {
  const catMap = Object.fromEntries(categorias.map((c, i) => [c.id, { nombre: c.nombre, color: CAT_COLORS[i % CAT_COLORS.length] }]))

  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <p className="text-gray-400 text-sm">No hay productos aún.</p>
        <Link href="/admin/menu/nuevo" className="mt-3 inline-block text-sm font-semibold text-brand-primary hover:underline">
          + Crear el primero
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_56px_88px_72px] gap-x-3 items-center px-4 py-2.5 border-b border-gray-100">
        <div />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Producto</span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Precio</span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Estado</span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Acciones</span>
      </div>

      {/* Rows */}
      <ul className="divide-y divide-gray-50">
        {productos.map(p => {
          const cat = catMap[p.categoria_id]
          return (
            <li
              key={p.id}
              className={`grid grid-cols-[40px_1fr_56px_88px_72px] gap-x-3 items-center px-4 py-3 transition-colors ${
                p.disponible ? 'hover:bg-gray-50' : 'bg-gray-50/60 hover:bg-gray-100/40'
              }`}
            >
              {/* Imagen */}
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {p.imagen_url ? (
                  <Image src={p.imagen_url} alt={p.nombre} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-base text-gray-300">
                    🥗
                  </div>
                )}
              </div>

              {/* Nombre + categoría */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-medium text-sm truncate ${p.disponible ? 'text-gray-800' : 'text-gray-400'}`}>
                    {p.nombre}
                  </span>
                  {cat && (
                    <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cat.color}`}>
                      {cat.nombre}
                    </span>
                  )}
                </div>
                {p.descripcion && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{p.descripcion}</p>
                )}
              </div>

              {/* Precio */}
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-700">${p.precio.toFixed(0)}</span>
              </div>

              {/* Toggles disponible + destacado */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-1.5">
                  <ToggleSwitch
                    checked={p.disponible}
                    label={`${p.nombre} disponible`}
                    onToggle={v => toggleDisponible(p.id, v)}
                  />
                  <span className="text-[10px] text-gray-400 leading-none">Disp.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ToggleSwitch
                    checked={p.destacado}
                    label={`${p.nombre} destacado`}
                    onToggle={v => toggleDestacado(p.id, v)}
                  />
                  <span className="text-[10px] text-gray-400 leading-none">Dest.</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/admin/menu/${p.id}/editar`}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-brand-primary-dark hover:bg-brand-surface transition-colors"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
                <DeleteButton id={p.id} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
