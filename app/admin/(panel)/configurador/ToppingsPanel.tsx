'use client'

import { useRef, useState, useTransition } from 'react'
import { ToggleSwitch } from '@/components/admin/ToggleSwitch'
import { createTopping, updateTopping, toggleToppingDisponible, deleteTopping } from './actions'
import type { Topping } from '@/lib/data/configurador'

interface Props { toppings: Topping[] }

type TipoTab = 'base' | 'especial'

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
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-1">Toppings</h2>
      <p className="text-xs text-gray-400 mb-4">Los toppings base no tienen costo extra; los especiales sí.</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1 w-fit">
        {(['base', 'especial'] as TipoTab[]).map(tipo => (
          <button
            key={tipo}
            onClick={() => { setTab(tipo); setEditingId(null) }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
              tab === tipo ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="grid grid-cols-[1fr_64px_56px_28px] gap-2 px-1 mb-1">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Nombre</span>
        {tab === 'especial' && (
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">Extra</span>
        )}
        {tab === 'base' && <span />}
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-center">Disp.</span>
        <span />
      </div>

      <ul className="divide-y divide-gray-50 mb-4 min-h-[60px]">
        {filtered.length === 0 && (
          <li className="py-4 text-sm text-gray-400 text-center">Sin toppings {tab}s todavía.</li>
        )}
        {filtered.map(t => (
          <li key={t.id} className="py-2">
            {editingId === t.id ? (
              <div className="grid grid-cols-[1fr_64px] gap-2 items-center">
                <input
                  autoFocus
                  value={edit.nombre}
                  onChange={e => setEdit(s => ({ ...s, nombre: e.target.value }))}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light"
                />
                {tab === 'especial' && (
                  <input
                    type="number"
                    value={edit.precio_extra}
                    onChange={e => setEdit(s => ({ ...s, precio_extra: e.target.value }))}
                    className="px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-primary-light"
                  />
                )}
                <div className="col-span-2 flex gap-2 mt-1">
                  <button onClick={() => saveEdit(t.id)} disabled={saving} className="text-xs font-semibold text-brand-primary-dark hover:underline disabled:opacity-50">Guardar</button>
                  <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:underline">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-[1fr_64px_56px_28px] gap-2 items-center">
                <span className={`text-sm font-medium ${t.disponible ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                  {t.nombre}
                </span>
                <span className="text-sm text-gray-500 text-right">
                  {t.precio_extra > 0 ? `+$${t.precio_extra}` : '—'}
                </span>
                <div className="flex justify-center">
                  <ToggleSwitch
                    checked={t.disponible}
                    label={`${t.nombre} disponible`}
                    onToggle={v => toggleToppingDisponible(t.id, v)}
                  />
                </div>
                <div className="flex justify-end gap-1">
                  <button onClick={() => startEdit(t)} className="text-gray-300 hover:text-gray-600 transition-colors" title="Editar">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { if (confirm(`¿Eliminar "${t.nombre}"?`)) deleteTopping(t.id) }}
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

      <form ref={formRef} action={handleCreate} className="flex gap-2 items-end">
        <input name="tipo" type="hidden" value={tab} />
        <div className="flex-1">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Nombre</label>
          <input name="nombre" required placeholder={`Nuevo topping ${tab}…`} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-light" />
        </div>
        {tab === 'especial' && (
          <div className="w-20">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">+Precio</label>
            <input name="precio_extra" type="number" min={0} step={0.01} defaultValue={0} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-primary-light" />
          </div>
        )}
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
