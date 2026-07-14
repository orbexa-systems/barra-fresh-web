'use client'

import { useRef, useState, useTransition } from 'react'
import { ToggleSwitch } from '@/components/admin/ToggleSwitch'
import { createAderezo, updateAderezo, toggleAderezoDisponible, deleteAderezo } from './actions'
import type { Aderezo } from '@/lib/data/configurador'

interface Props { aderezos: Aderezo[] }

const INPUT = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors'

export function AderezosPanel({ aderezos }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [saving, startSaving] = useTransition()
  const [creating, startCreating] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function startEdit(a: Aderezo) {
    setEditingId(a.id)
    setEditNombre(a.nombre)
  }

  function saveEdit(id: string) {
    startSaving(async () => {
      await updateAderezo(id, editNombre.trim())
      setEditingId(null)
    })
  }

  function handleCreate(formData: FormData) {
    startCreating(async () => {
      await createAderezo(formData)
      formRef.current?.reset()
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
      {/* Card header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-[15px] font-semibold text-gray-900">Aderezos</h2>
        <p className="text-sm text-gray-500 mt-0.5">El cliente elige uno al configurar su ensalada.</p>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
        <span className="flex-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Aderezo</span>
        <span className="w-24 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center shrink-0">Disponible</span>
        <span className="w-16 shrink-0" />
      </div>

      {/* Rows */}
      <ul className="flex-1 divide-y divide-gray-100">
        {aderezos.length === 0 && (
          <li className="px-6 py-10 text-center text-sm text-gray-400">No hay aderezos todavía.</li>
        )}
        {aderezos.map(a => (
          <li key={a.id}>
            {editingId === a.id ? (
              <div className="px-6 py-4 bg-brand-surface/40">
                <input
                  autoFocus
                  value={editNombre}
                  onChange={e => setEditNombre(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveEdit(a.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  placeholder="Nombre del aderezo"
                  className={`${INPUT} mb-3`}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => saveEdit(a.id)}
                    disabled={saving || !editNombre.trim()}
                    className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary-dark text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className={`flex items-center gap-4 px-6 py-4 min-h-[60px] transition-colors ${a.disponible ? 'hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100/60'}`}>
                <span className={`flex-1 text-sm font-medium ${a.disponible ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                  {a.nombre}
                </span>
                <div className="w-24 flex justify-center shrink-0">
                  <ToggleSwitch
                    checked={a.disponible}
                    label={`${a.nombre} disponible`}
                    onToggle={v => toggleAderezoDisponible(a.id, v)}
                  />
                </div>
                <div className="w-16 flex items-center justify-end gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(a)}
                    title="Editar aderezo"
                    className="p-2 rounded-lg text-gray-400 hover:text-brand-primary hover:bg-brand-surface transition-colors"
                  >
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { if (confirm(`¿Eliminar "${a.nombre}"?`)) deleteAderezo(a.id) }}
                    title="Eliminar aderezo"
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Add form */}
      <form ref={formRef} action={handleCreate} className="px-6 py-5 border-t border-gray-100 bg-gray-50/40 mt-auto">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Agregar aderezo</p>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre</label>
            <input name="nombre" required placeholder="Ej. Vinagreta…" className={INPUT} />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="shrink-0 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {creating ? '…' : '+ Agregar'}
          </button>
        </div>
      </form>
    </div>
  )
}
