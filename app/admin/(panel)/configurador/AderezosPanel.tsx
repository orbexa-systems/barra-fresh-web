'use client'

import { useRef, useState, useTransition } from 'react'
import { ToggleSwitch } from '@/components/admin/ToggleSwitch'
import { createAderezo, updateAderezo, toggleAderezoDisponible, deleteAderezo } from './actions'
import type { Aderezo } from '@/lib/data/configurador'

interface Props { aderezos: Aderezo[] }

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
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-1">Aderezos</h2>
      <p className="text-xs text-gray-400 mb-4">El cliente elige uno al configurar su ensalada.</p>

      <ul className="divide-y divide-gray-50 mb-4">
        {aderezos.length === 0 && (
          <li className="py-4 text-sm text-gray-400 text-center">Sin aderezos todavía.</li>
        )}
        {aderezos.map(a => (
          <li key={a.id} className="flex items-center gap-3 py-2.5">
            {editingId === a.id ? (
              <>
                <input
                  autoFocus
                  value={editNombre}
                  onChange={e => setEditNombre(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveEdit(a.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light"
                />
                <button onClick={() => saveEdit(a.id)} disabled={saving} className="text-xs font-semibold text-brand-primary-dark hover:underline disabled:opacity-50">Guardar</button>
                <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:underline">Cancelar</button>
              </>
            ) : (
              <>
                <span className={`flex-1 text-sm font-medium ${a.disponible ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                  {a.nombre}
                </span>
                <ToggleSwitch
                  checked={a.disponible}
                  label={`${a.nombre} disponible`}
                  onToggle={v => toggleAderezoDisponible(a.id, v)}
                />
                <button onClick={() => startEdit(a)} className="text-gray-300 hover:text-gray-600 transition-colors" title="Editar">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => { if (confirm(`¿Eliminar "${a.nombre}"?`)) deleteAderezo(a.id) }}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                  title="Eliminar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <form ref={formRef} action={handleCreate} className="flex gap-2">
        <input
          name="nombre"
          required
          placeholder="Nuevo aderezo…"
          className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light"
        />
        <button
          type="submit"
          disabled={creating}
          className="px-3 py-1.5 rounded-lg bg-brand-surface text-brand-primary-dark text-xs font-semibold hover:bg-brand-surface-mid transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {creating ? '…' : '+ Agregar'}
        </button>
      </form>
    </div>
  )
}
