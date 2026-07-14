'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { ToggleSwitch } from './ToggleSwitch'
import {
  createCategoria,
  toggleCategoriaActiva,
  updateCategoriaNombre,
} from '@/app/admin/(panel)/menu/actions'
import type { Categoria } from '@/lib/data/categorias'

interface Props {
  open: boolean
  onClose: () => void
  categorias: Categoria[]
}

export function CategoryModal({ open, onClose, categorias }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [saving, startSaving] = useTransition()
  const [creating, startCreating] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) { setEditingId(null); setEditNombre('') }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cat-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 id="cat-modal-title" className="text-base font-semibold text-gray-900">
            Gestionar categorías
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista */}
        <ul className="flex-1 overflow-y-auto divide-y divide-gray-50 px-6">
          {categorias.map(c => (
            <li key={c.id} className="flex items-center gap-3 py-3">
              {editingId === c.id ? (
                <>
                  <input
                    autoFocus
                    value={editNombre}
                    onChange={e => setEditNombre(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit(c.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                  <button
                    onClick={() => saveEdit(c.id)}
                    disabled={saving || !editNombre.trim()}
                    className="text-xs font-semibold text-brand-primary-dark hover:underline disabled:opacity-50"
                  >
                    Guardar
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:underline">
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span className={`flex-1 text-sm font-medium ${c.activo ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                    {c.nombre}
                  </span>
                  <button
                    onClick={() => { setEditingId(c.id); setEditNombre(c.nombre) }}
                    className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
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

        {/* Agregar */}
        <div className="px-6 py-4 border-t border-gray-100">
          <form ref={formRef} action={handleCreate} className="flex gap-2">
            <input
              name="nombre"
              required
              placeholder="Nueva categoría…"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-lg bg-brand-surface text-brand-primary-dark text-sm font-semibold hover:bg-brand-surface-mid transition-colors disabled:opacity-50"
            >
              {creating ? '…' : '+ Agregar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
