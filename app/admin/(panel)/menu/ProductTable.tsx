'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ToggleSwitch } from '@/components/admin/ToggleSwitch'
import { toggleDisponible, toggleDestacado, deleteProducto } from './actions'
import type { Producto } from '@/lib/data/productos'
import type { Categoria } from '@/lib/data/categorias'

interface Props {
  productos: Producto[]
  categorias: Categoria[]
}

function DeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    startTransition(() => deleteProducto(id))
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors"
    >
      {pending ? '…' : 'Eliminar'}
    </button>
  )
}

export function ProductTable({ productos, categorias }: Props) {
  const catMap = Object.fromEntries(categorias.map(c => [c.id, c.nombre]))

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
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-14"></th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Producto</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Categoría</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Precio</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Disponible</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Destacado</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {productos.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                {/* Imagen */}
                <td className="px-5 py-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {p.imagen_url ? (
                      <Image src={p.imagen_url} alt={p.nombre} fill className="object-cover" />
                    ) : (
                      <span className="flex items-center justify-center h-full text-gray-300 text-lg">🥗</span>
                    )}
                  </div>
                </td>
                {/* Nombre */}
                <td className="px-5 py-3">
                  <p className={`font-medium ${p.disponible ? 'text-gray-800' : 'text-gray-400'}`}>{p.nombre}</p>
                  {p.descripcion && (
                    <p className="text-xs text-gray-400 truncate max-w-xs">{p.descripcion}</p>
                  )}
                </td>
                {/* Categoría */}
                <td className="px-5 py-3 hidden sm:table-cell">
                  <span className="text-xs bg-brand-surface text-brand-primary-dark px-2 py-0.5 rounded-full">
                    {catMap[p.categoria_id] ?? '—'}
                  </span>
                </td>
                {/* Precio */}
                <td className="px-5 py-3 text-right font-semibold text-gray-700">
                  ${p.precio.toFixed(0)}
                </td>
                {/* Disponible */}
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center">
                    <ToggleSwitch
                      checked={p.disponible}
                      label={`${p.nombre} disponible`}
                      onToggle={v => toggleDisponible(p.id, v)}
                    />
                  </div>
                </td>
                {/* Destacado */}
                <td className="px-4 py-3 text-center hidden md:table-cell">
                  <div className="flex justify-center">
                    <ToggleSwitch
                      checked={p.destacado}
                      label={`${p.nombre} destacado`}
                      onToggle={v => toggleDestacado(p.id, v)}
                    />
                  </div>
                </td>
                {/* Acciones */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3 justify-end">
                    <Link
                      href={`/admin/menu/${p.id}/editar`}
                      className="text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
                    >
                      Editar
                    </Link>
                    <DeleteButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
