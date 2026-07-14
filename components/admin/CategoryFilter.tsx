'use client'

import type { Categoria } from '@/lib/data/categorias'

interface Props {
  categorias: Categoria[]
  selected: string | null
  onSelect: (id: string | null) => void
  onManage: () => void
}

export function CategoryFilter({ categorias, selected, onSelect, onManage }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onSelect(null)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            selected === null
              ? 'bg-brand-surface border-brand-primary text-brand-primary-dark'
              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          Todas
        </button>
        {categorias.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selected === c.id
                ? 'bg-brand-surface border-brand-primary text-brand-primary-dark'
                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <button
        onClick={onManage}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors whitespace-nowrap shrink-0"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        Gestionar categorías
      </button>
    </div>
  )
}
