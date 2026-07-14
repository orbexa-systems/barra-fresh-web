'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import { ToggleSwitch } from '@/components/admin/ToggleSwitch'
import { toggleDisponible, toggleDestacado } from './actions'
import type { Producto } from '@/lib/data/productos'
import type { Categoria } from '@/lib/data/categorias'

const CAT_COLORS = [
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-sky-50 text-sky-700 border-sky-100',
  'bg-violet-50 text-violet-700 border-violet-100',
  'bg-amber-50 text-amber-700 border-amber-100',
  'bg-rose-50 text-rose-700 border-rose-100',
  'bg-teal-50 text-teal-700 border-teal-100',
]

interface Props {
  productos: Producto[]
  categorias: Categoria[]
  onEdit: (p: Producto) => void
  onAdd: () => void
  selectedCat: string | null
}

function ProductRow({
  producto: p,
  catInfo,
  onEdit,
}: {
  producto: Producto
  catInfo: { nombre: string; color: string } | undefined
  onEdit: () => void
}) {
  const [toggling, startToggle] = useTransition()
  const initial = p.nombre.charAt(0).toUpperCase()

  return (
    <li
      className={`flex items-center gap-5 px-5 py-4 border-b border-gray-100 last:border-0 transition-colors min-h-[80px] ${
        p.disponible ? 'hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100/60'
      }`}
    >
      {/* Imagen 56×56 */}
      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-brand-surface shrink-0">
        {p.imagen_url ? (
          <Image src={p.imagen_url} alt={p.nombre} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl font-bold text-brand-primary">{initial}</span>
          </div>
        )}
      </div>

      {/* Info producto */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[15px] font-semibold truncate ${p.disponible ? 'text-gray-900' : 'text-gray-400'}`}>
            {p.nombre}
          </span>
          {catInfo && (
            <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${catInfo.color}`}>
              {catInfo.nombre}
            </span>
          )}
        </div>
        {p.descripcion && (
          <p className="text-[13px] text-gray-500 truncate leading-snug">{p.descripcion}</p>
        )}
      </div>

      {/* Precio */}
      <div className="shrink-0 text-right w-16">
        <span className="text-[16px] font-semibold text-gray-900">${p.precio.toFixed(0)}</span>
      </div>

      {/* Toggles */}
      <div className="shrink-0 flex flex-col gap-2 w-28" aria-busy={toggling}>
        <div className="flex items-center gap-2">
          <ToggleSwitch
            checked={p.disponible}
            label={`${p.nombre} disponible`}
            onToggle={async v => { startToggle(() => toggleDisponible(p.id, v)) }}
          />
          <span className="text-[13px] text-gray-500">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <ToggleSwitch
            checked={p.destacado}
            label={`${p.nombre} destacado`}
            onToggle={async v => { startToggle(() => toggleDestacado(p.id, v)) }}
          />
          <span className="text-[13px] text-gray-500">Destacado</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="shrink-0 flex items-center gap-1">
        <button
          onClick={onEdit}
          title="Editar producto"
          className="p-2 rounded-lg text-gray-400 hover:text-brand-primary hover:bg-brand-surface transition-colors"
        >
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </li>
  )
}

export function ProductList({ productos, categorias, onEdit, onAdd, selectedCat }: Props) {
  const catMap = Object.fromEntries(
    categorias.map((c, i) => [c.id, { nombre: c.nombre, color: CAT_COLORS[i % CAT_COLORS.length] }])
  )

  const filtered = selectedCat
    ? productos.filter(p => p.categoria_id === selectedCat)
    : productos

  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-surface flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-brand-primary-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C7 2 3 7 3 12c0 2.5 1 4.8 2.6 6.5C7 20 9.4 21 12 21s5-1 6.4-2.5C20 16.8 21 14.5 21 12c0-5-4-10-9-10z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V10M12 10C12 10 8 8 6 5M12 10C12 10 16 8 18 5"/>
          </svg>
        </div>
        <p className="text-[15px] font-medium text-gray-600 mb-1">
          {selectedCat ? 'No hay productos en esta categoría' : 'Sin productos todavía'}
        </p>
        <p className="text-sm text-gray-400 mb-4">
          {selectedCat ? 'Prueba con otra categoría o agrega uno nuevo.' : 'Crea tu primer producto para empezar.'}
        </p>
        <button
          onClick={onAdd}
          className="text-sm font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
        >
          + Agregar producto
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Column headers */}
      <div className="flex items-center gap-5 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
        <div className="w-14 shrink-0" />
        <span className="flex-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Producto</span>
        <span className="w-16 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right shrink-0">Precio</span>
        <span className="w-28 text-[11px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">Estado</span>
        <div className="w-10 shrink-0" />
      </div>

      <ul>
        {filtered.map(p => (
          <ProductRow
            key={p.id}
            producto={p}
            catInfo={catMap[p.categoria_id]}
            onEdit={() => onEdit(p)}
          />
        ))}
      </ul>
    </div>
  )
}
