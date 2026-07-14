'use client'

import { useRef, useState, useTransition } from 'react'
import { ToggleSwitch } from '@/components/admin/ToggleSwitch'
import { createTamano, updateTamano, toggleTamanoActivo, deleteTamano } from './actions'
import type { TamanoEnsalada } from '@/lib/data/configurador'

interface Props { tamanos: TamanoEnsalada[] }
type EditState = { nombre: string; precio: string; max_toppings: string }

const INPUT = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors'

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
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Card header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-[15px] font-semibold text-gray-900">Tamaños de ensalada</h2>
        <p className="text-sm text-gray-500 mt-0.5">Precio base y máximo de toppings incluidos por tamaño.</p>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
        <span className="flex-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tamaño</span>
        <span className="w-24 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right shrink-0">Precio base</span>
        <span className="w-32 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center shrink-0">Máx. toppings</span>
        <span className="w-16 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center shrink-0">Activo</span>
        <span className="w-16 shrink-0" />
      </div>

      {/* Rows */}
      <ul className="divide-y divide-gray-100">
        {tamanos.length === 0 && (
          <li className="px-6 py-10 text-center text-sm text-gray-400">No hay tamaños todavía.</li>
        )}
        {tamanos.map(t => (
          <li key={t.id}>
            {editingId === t.id ? (
              /* Edit row */
              <div className="px-6 py-4 bg-brand-surface/40">
                <div className="flex items-center gap-4 mb-3">
                  <input
                    autoFocus
                    value={edit.nombre}
                    onChange={e => setEdit(s => ({ ...s, nombre: e.target.value }))}
                    placeholder="Nombre"
                    className={`flex-1 ${INPUT}`}
                  />
                  <div className="relative w-24 shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                    <input
                      type="number"
                      value={edit.precio}
                      onChange={e => setEdit(s => ({ ...s, precio: e.target.value }))}
                      className={`w-full pl-6 pr-3 py-2 rounded-xl border border-gray-200 text-sm text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors`}
                    />
                  </div>
                  <input
                    type="number"
                    value={edit.max_toppings}
                    onChange={e => setEdit(s => ({ ...s, max_toppings: e.target.value }))}
                    className={`w-32 text-center shrink-0 ${INPUT}`}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => saveEdit(t.id)}
                    disabled={saving || !edit.nombre.trim()}
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
              /* Display row */
              <div className={`flex items-center gap-4 px-6 py-4 min-h-[64px] transition-colors ${t.activo ? 'hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100/60'}`}>
                <span className={`flex-1 text-[15px] font-semibold ${t.activo ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                  {t.nombre}
                </span>
                <span className="w-24 text-sm font-medium text-gray-700 text-right shrink-0">
                  ${t.precio.toFixed(0)}
                </span>
                <span className="w-32 text-sm text-gray-600 text-center shrink-0">
                  {t.max_toppings} toppings
                </span>
                <div className="w-16 flex justify-center shrink-0">
                  <ToggleSwitch
                    checked={t.activo}
                    label={`${t.nombre} activo`}
                    onToggle={v => toggleTamanoActivo(t.id, v)}
                  />
                </div>
                <div className="w-16 flex items-center justify-end gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(t)}
                    title="Editar tamaño"
                    className="p-2 rounded-lg text-gray-400 hover:text-brand-primary hover:bg-brand-surface transition-colors"
                  >
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { if (confirm(`¿Eliminar "${t.nombre}"? Esta acción no se puede deshacer.`)) deleteTamano(t.id) }}
                    title="Eliminar tamaño"
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
      <form ref={formRef} action={handleCreate} className="px-6 py-5 border-t border-gray-100 bg-gray-50/40">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Agregar tamaño</p>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre</label>
            <input name="nombre" required placeholder="Ej. Grande" className={INPUT} />
          </div>
          <div className="w-24 shrink-0">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Precio</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
              <input name="precio" type="number" required min={0} step={0.01} placeholder="0" className="w-full pl-6 pr-3 py-2 rounded-xl border border-gray-200 text-sm text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors" />
            </div>
          </div>
          <div className="w-32 shrink-0">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Máx. toppings</label>
            <input name="max_toppings" type="number" required min={0} defaultValue={5} className={`text-center ${INPUT}`} />
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
