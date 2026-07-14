'use client'

import { useRef, useState, useTransition } from 'react'
import { ToggleSwitch } from '@/components/admin/ToggleSwitch'
import { createTopping, updateTopping, toggleToppingDisponible, deleteTopping } from './actions'
import type { Topping } from '@/lib/data/configurador'

interface Props { toppings: Topping[] }
type TipoTab = 'base' | 'especial'

const INPUT = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors'

export function ToppingsPanel({ toppings }: Props) {
  const [tab, setTab] = useState<TipoTab>('base')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [edit, setEdit] = useState({ nombre: '', precio_extra: '' })
  const [saving, startSaving] = useTransition()
  const [creating, startCreating] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const filtered = toppings.filter(t => t.tipo === tab)

  function startEdit(t: Topping) {
    setEditingId(t.id)
    setEdit({ nombre: t.nombre, precio_extra: String(t.precio_extra) })
  }

  function saveEdit(id: string) {
    startSaving(async () => {
      await updateTopping(id, { nombre: edit.nombre.trim(), precio_extra: Number(edit.precio_extra) })
      setEditingId(null)
    })
  }

  function handleCreate(formData: FormData) {
    startCreating(async () => {
      await createTopping(formData)
      formRef.current?.reset()
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
      {/* Card header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900">Toppings</h2>
            <p className="text-sm text-gray-500 mt-0.5">Ingredientes disponibles para el armador.</p>
          </div>
          {/* Tabs dentro del header */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {(['base', 'especial'] as TipoTab[]).map(tipo => (
              <button
                key={tipo}
                onClick={() => { setTab(tipo); setEditingId(null) }}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-colors capitalize ${
                  tab === tipo
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>
        {tab === 'especial' && (
          <p className="text-xs text-brand-accent-text bg-brand-accent-surface border border-brand-accent-border rounded-lg px-3 py-1.5 mt-3">
            Los toppings especiales tienen un costo extra que se suma al precio del tamaño.
          </p>
        )}
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
        <span className="flex-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Nombre</span>
        {tab === 'especial' && (
          <span className="w-20 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right shrink-0">Precio extra</span>
        )}
        <span className="w-24 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center shrink-0">Disponible</span>
        <span className="w-16 shrink-0" />
      </div>

      {/* Rows */}
      <ul className="flex-1 divide-y divide-gray-100">
        {filtered.length === 0 && (
          <li className="px-6 py-10 text-center text-sm text-gray-400">
            No hay toppings {tab === 'base' ? 'base' : 'especiales'} todavía.
          </li>
        )}
        {filtered.map(t => (
          <li key={t.id}>
            {editingId === t.id ? (
              <div className="px-6 py-4 bg-brand-surface/40">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    autoFocus
                    value={edit.nombre}
                    onChange={e => setEdit(s => ({ ...s, nombre: e.target.value }))}
                    placeholder="Nombre del topping"
                    className={`flex-1 ${INPUT}`}
                  />
                  {tab === 'especial' && (
                    <div className="relative w-24 shrink-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">+$</span>
                      <input
                        type="number"
                        value={edit.precio_extra}
                        onChange={e => setEdit(s => ({ ...s, precio_extra: e.target.value }))}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-sm text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                      />
                    </div>
                  )}
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
              <div className={`flex items-center gap-4 px-6 py-4 min-h-[60px] transition-colors ${t.disponible ? 'hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100/60'}`}>
                <span className={`flex-1 text-sm font-medium ${t.disponible ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                  {t.nombre}
                </span>
                {tab === 'especial' && (
                  <span className="w-20 text-sm font-medium text-right shrink-0">
                    {t.precio_extra > 0
                      ? <span className="text-brand-accent-text">+${t.precio_extra.toFixed(0)}</span>
                      : <span className="text-gray-400">—</span>}
                  </span>
                )}
                <div className="w-24 flex justify-center shrink-0">
                  <ToggleSwitch
                    checked={t.disponible}
                    label={`${t.nombre} disponible`}
                    onToggle={v => toggleToppingDisponible(t.id, v)}
                  />
                </div>
                <div className="w-16 flex items-center justify-end gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(t)}
                    title="Editar topping"
                    className="p-2 rounded-lg text-gray-400 hover:text-brand-primary hover:bg-brand-surface transition-colors"
                  >
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { if (confirm(`¿Eliminar "${t.nombre}"?`)) deleteTopping(t.id) }}
                    title="Eliminar topping"
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
        <input name="tipo" type="hidden" value={tab} />
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Agregar topping {tab}
        </p>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre</label>
            <input name="nombre" required placeholder={`Nuevo topping ${tab}…`} className={INPUT} />
          </div>
          {tab === 'especial' && (
            <div className="w-24 shrink-0">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Precio extra</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">+$</span>
                <input name="precio_extra" type="number" min={0} step={0.01} defaultValue={0} className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-sm text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors" />
              </div>
            </div>
          )}
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
