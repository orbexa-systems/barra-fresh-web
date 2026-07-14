'use client'

import { useRef, useState, useTransition } from 'react'
import { ToggleSwitch } from '@/components/admin/ToggleSwitch'
import { createTamano, updateTamano, toggleTamanoActivo, deleteTamano } from './actions'
import type { TamanoEnsalada } from '@/lib/data/configurador'

interface Props { tamanos: TamanoEnsalada[] }

type EditState = { nombre: string; precio: string; max_toppings: string }

export function TamanosPanel({ tamanos }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [edit, setEdit] = useState<EditState>({ nombre: '', precio: '', max_toppings: '' })
  const [saving, startSaving] = useTransition()
  const [creating, startCreating] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function startEdit(t: TamanoEnsalada) {
    setEditingId(t.id)
    setEdit({ nombre: t.nombre, precio: String(t.precio), max_toppings: String(t.max_toppings) })
  }

  function saveEdit(id: string) {
    startSaving(async () => {
      await updateTamano(id, {
        nombre: edit.nombre.trim(),
        precio: Number(edit.precio),
        max_toppings: Number(edit.max_toppings),
      })
      setEditingId(null)
    })
  }

  function handleCreate(formData: FormData) {
    startCreating(async () => {
      await createTamano(formData)
      formRef.current?.reset()
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-1">Tamaños de ensalada</h2>
      <p className="text-xs text-gray-400 mb-4">Define el precio base y máximo de toppings por tamaño.</p>

      {/* Header columnas */}
      <div className="grid grid-cols-[1fr_64px_48px_56px_32px] gap-2 px-1 mb-1">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Nombre</span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">Precio</span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center">Tops</span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center">Activo</span>
        <span />
      </div>

      <ul className="divide-y divide-gray-50 mb-4">
        {tamanos.map(t => (
          <li key={t.id} className="py-2">
            {editingId === t.id ? (
              <div className="grid grid-cols-[1fr_64px_48px] gap-2 items-center">
                <input
                  autoFocus
                  value={edit.nombre}
                  onChange={e => setEdit(s => ({ ...s, nombre: e.target.value }))}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light"
                />
                <input
                  type="number"
                  value={edit.precio}
                  onChange={e => setEdit(s => ({ ...s, precio: e.target.value }))}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-primary-light"
                />
                <input
                  type="number"
                  value={edit.max_toppings}
                  onChange={e => setEdit(s => ({ ...s, max_toppings: e.target.value }))}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-primary-light"
                />
                <div className="col-span-3 flex gap-2 mt-1">
                  <button
                    onClick={() => saveEdit(t.id)}
                    disabled={saving}
                    className="text-xs font-semibold text-brand-primary-dark hover:underline disabled:opacity-50"
                  >
                    Guardar
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:underline">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-[1fr_64px_48px_56px_32px] gap-2 items-center">
                <span className={`text-sm font-medium ${t.activo ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                  {t.nombre}
                </span>
                <span className="text-sm text-gray-700 text-right">${t.precio}</span>
                <span className="text-sm text-gray-500 text-center">{t.max_toppings}</span>
                <div className="flex justify-center">
                  <ToggleSwitch
                    checked={t.activo}
                    label={`${t.nombre} activo`}
                    onToggle={v => toggleTamanoActivo(t.id, v)}
                  />
                </div>
                <div className="flex justify-end gap-1">
                  <button onClick={() => startEdit(t)} className="text-gray-300 hover:text-gray-600 transition-colors" title="Editar">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { if (confirm(`¿Eliminar "${t.nombre}"?`)) deleteTamano(t.id) }}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <form ref={formRef} action={handleCreate} className="grid grid-cols-[1fr_64px_48px_auto] gap-2 items-end">
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Nombre</label>
          <input name="nombre" required placeholder="Ej. Grande" className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Precio</label>
          <input name="precio" type="number" required min={0} step={0.01} placeholder="0" className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-primary-light" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Tops</label>
          <input name="max_toppings" type="number" required min={0} defaultValue={5} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-primary-light" />
        </div>
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
