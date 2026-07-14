'use client'

import { useRef, useState, useTransition } from 'react'
import { ToggleSwitch } from './ToggleSwitch'
import type { Categoria } from '@/lib/data/categorias'
import {
  createCategoria,
  toggleCategoriaActiva,
  updateCategoriaNombre,
} from '@/app/admin/(panel)/menu/actions'

interface Props {
  categorias: Categoria[]
}

export function CategoryManager({ categorias }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [saving, startSaving] = useTransition()
  const [creating, startCreating] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function startEdit(c: Categoria) {
    setEditingId(c.id)
    setEditNombre(c.nombre)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditNombre('')
  }

  function saveEdit(id: string) {
    startSaving(async () => {
      await updateCategoriaNombre(id, editNombre.trim())
      setEditingId(null)
    })
  }

  function handleCreate(formData: FormData) {
    startCreating(async () => {
      await createCategoria(formData)
      formRef.current?.reset()
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Categorías</h2>

      <ul className="divide-y divide-gray-50 mb-4">
        {categorias.map(c => (
          <li key={c.id} className="flex items-center gap-3 py-2.5">
            {editingId === c.id ? (
              <>
                <input
                  autoFocus
                  value={editNombre}
                  onChange={e => setEditNombre(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light"
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveEdit(c.id)
                    if (e.key === 'Escape') cancelEdit()
                  }}
                />
                <button
                  onClick={() => saveEdit(c.id)}
                  disabled={saving || !editNombre.trim()}
                  className="text-xs font-semibold text-brand-primary-dark hover:underline disabled:opacity-50"
                >
                  Guardar
                </button>
                <button onClick={cancelEdit} className="text-xs text-gray-400 hover:underline">
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className={`flex-1 text-sm ${c.activo ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                  {c.nombre}
                </span>
                <button
                  onClick={() => startEdit(c)}
                  className="text-xs text-gray-400 hover:text-gray-700"
                >
                  Editar
                </button>
                <ToggleSwitch
                  checked={c.activo}
                  label={`Categoría ${c.nombre} activa`}
                  onToggle={v => toggleCategoriaActiva(c.id, v)}
                />
              </>
            )}
          </li>
        ))}
      </ul>

      <form
        ref={formRef}
        action={handleCreate}
        className="flex gap-2"
      >
        <input
          name="nombre"
          required
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light"
          placeholder="Nueva categoría…"
        />
        <button
          type="submit"
          disabled={creating}
          className="px-4 py-2 rounded-xl bg-brand-surface text-brand-primary-dark text-sm font-semibold hover:bg-brand-surface-mid transition-colors disabled:opacity-50"
        >
          {creating ? '…' : '+ Agregar'}
        </button>
      </form>
    </div>
  )
}
