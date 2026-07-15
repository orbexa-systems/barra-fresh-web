'use client'

import type { Categoria } from '@/lib/data/categorias'

interface Props {
  categorias: Categoria[]
  selected: string | null
  onSelect: (id: string | null) => void
}

export function FiltroCategorias({ categorias, selected, onSelect }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onSelect(null)}
        className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
          selected === null
            ? 'bg-brand-surface border-brand-primary text-brand-primary-dark'
            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
        }`}
      >
        Todos
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
  )
}
