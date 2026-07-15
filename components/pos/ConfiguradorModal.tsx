'use client'

import { useState, useEffect } from 'react'
import type { TamanoEnsalada, Topping, Aderezo } from '@/lib/data/configurador'
import type { EnsaladaConfig } from '@/app/pos/POSClient'

const PASOS = ['Tamaño', 'Toppings base', 'Toppings especiales', 'Aderezo']

function formatMXN(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

interface Props {
  open: boolean
  onClose: () => void
  tamanos: TamanoEnsalada[]
  toppings: Topping[]
  aderezos: Aderezo[]
  onAgregar: (config: EnsaladaConfig) => void
}

export function ConfiguradorModal({ open, onClose, tamanos, toppings, aderezos, onAgregar }: Props) {
  const [paso, setPaso] = useState(0)
  const [tamano, setTamano] = useState<TamanoEnsalada | null>(null)
  const [topsBase, setTopsBase] = useState<Topping[]>([])
  const [topsEspeciales, setTopsEspeciales] = useState<Topping[]>([])
  const [aderezo, setAderezo] = useState<Aderezo | null>(null)
  const [notasEnsalada, setNotasEnsalada] = useState('')

  const toppingBase = toppings.filter(t => t.tipo === 'base')
  const toppingEspecial = toppings.filter(t => t.tipo === 'especial')

  const precioExtra = topsEspeciales.reduce((sum, t) => sum + t.precio_extra, 0)
  const precioTotal = (tamano?.precio ?? 0) + precioExtra

  const puedeAvanzar =
    (paso === 0 && tamano !== null) ||
    (paso === 1) ||
    (paso === 2) ||
    (paso === 3 && aderezo !== null)

  useEffect(() => {
    if (!open) return
    setPaso(0)
    setTamano(null)
    setTopsBase([])
    setTopsEspeciales([])
    setAderezo(null)
    setNotasEnsalada('')
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function toggleTopBase(t: Topping) {
    setTopsBase(prev =>
      prev.find(x => x.id === t.id) ? prev.filter(x => x.id !== t.id) : [...prev, t]
    )
  }

  function toggleTopEspecial(t: Topping) {
    setTopsEspeciales(prev =>
      prev.find(x => x.id === t.id) ? prev.filter(x => x.id !== t.id) : [...prev, t]
    )
  }

  function confirmar() {
    if (!tamano || !aderezo) return
    onAgregar({ tamano, toppingsBase: topsBase, toppingsEspeciales: topsEspeciales, aderezo, notas: notasEnsalada })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-gray-900">Armar ensalada</h2>
            {tamano && (
              <p className="text-[13px] text-gray-400 mt-0.5">
                {tamano.nombre} · <span className="font-semibold text-brand-primary">{formatMXN(precioTotal)}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-0 px-6 pb-4 shrink-0">
          {PASOS.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${i <= paso ? 'text-brand-primary-dark' : 'text-gray-300'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                  i < paso ? 'bg-brand-primary text-white' :
                  i === paso ? 'bg-brand-surface border-2 border-brand-primary text-brand-primary-dark' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {i < paso ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-[12px] font-medium hidden sm:block ${i === paso ? 'text-gray-900' : ''}`}>{label}</span>
              </div>
              {i < PASOS.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${i < paso ? 'bg-brand-primary' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="h-px bg-gray-100 shrink-0" />

        {/* Contenido del paso */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Paso 0: Tamaño */}
          {paso === 0 && (
            <div className="space-y-3">
              <p className="text-[13px] text-gray-500 mb-4">Selecciona el tamaño de tu ensalada</p>
              {tamanos.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTamano(t)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                    tamano?.id === t.id
                      ? 'border-brand-primary bg-brand-surface'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <p className={`text-[15px] font-semibold ${tamano?.id === t.id ? 'text-brand-primary-dark' : 'text-gray-900'}`}>
                      {t.nombre}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      Hasta {t.max_toppings} toppings base
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[18px] font-bold ${tamano?.id === t.id ? 'text-brand-primary' : 'text-gray-900'}`}>
                      {formatMXN(t.precio)}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      tamano?.id === t.id ? 'border-brand-primary bg-brand-primary' : 'border-gray-300'
                    }`}>
                      {tamano?.id === t.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Paso 1: Toppings base */}
          {paso === 1 && (
            <div>
              <p className="text-[13px] text-gray-500 mb-1">
                Selecciona hasta <strong>{tamano?.max_toppings}</strong> toppings base — sin costo extra
              </p>
              <p className="text-[12px] text-gray-400 mb-4">
                {topsBase.length} de {tamano?.max_toppings} seleccionados
              </p>
              <div className="grid grid-cols-2 gap-2">
                {toppingBase.map(t => {
                  const selected = !!topsBase.find(x => x.id === t.id)
                  const maxReached = !selected && topsBase.length >= (tamano?.max_toppings ?? 99)
                  return (
                    <button
                      key={t.id}
                      onClick={() => !maxReached && toggleTopBase(t)}
                      disabled={maxReached}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                        selected
                          ? 'border-brand-primary bg-brand-surface'
                          : maxReached
                          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                        selected ? 'border-brand-primary bg-brand-primary' : 'border-gray-300'
                      }`}>
                        {selected && (
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </div>
                      <span className={`text-[13px] font-medium ${selected ? 'text-brand-primary-dark' : 'text-gray-700'}`}>
                        {t.nombre}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Paso 2: Toppings especiales */}
          {paso === 2 && (
            <div>
              <p className="text-[13px] text-gray-500 mb-4">
                Toppings especiales — cada uno tiene costo extra
              </p>
              {toppingEspecial.length === 0 ? (
                <p className="text-[13px] text-gray-400 py-4 text-center">No hay toppings especiales disponibles</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {toppingEspecial.map(t => {
                    const selected = !!topsEspeciales.find(x => x.id === t.id)
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleTopEspecial(t)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                          selected
                            ? 'border-brand-primary bg-brand-surface'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                          selected ? 'border-brand-primary bg-brand-primary' : 'border-gray-300'
                        }`}>
                          {selected && (
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[13px] font-medium truncate ${selected ? 'text-brand-primary-dark' : 'text-gray-700'}`}>
                            {t.nombre}
                          </p>
                          <p className="text-[11px] text-brand-accent font-semibold">+{formatMXN(t.precio_extra)}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Paso 3: Aderezo + notas */}
          {paso === 3 && (
            <div className="space-y-5">
              <div>
                <p className="text-[13px] text-gray-500 mb-3">Selecciona un aderezo</p>
                <div className="grid grid-cols-2 gap-2">
                  {aderezos.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setAderezo(a)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                        aderezo?.id === a.id
                          ? 'border-brand-primary bg-brand-surface'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        aderezo?.id === a.id ? 'border-brand-primary bg-brand-primary' : 'border-gray-300'
                      }`}>
                        {aderezo?.id === a.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className={`text-[13px] font-medium ${aderezo?.id === a.id ? 'text-brand-primary-dark' : 'text-gray-700'}`}>
                        {a.nombre}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-700 block mb-1.5">
                  Notas especiales <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  value={notasEnsalada}
                  onChange={e => setNotasEnsalada(e.target.value)}
                  placeholder="Ej: sin cebolla, extra limón..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-shadow resize-none"
                />
              </div>

              {/* Resumen */}
              {tamano && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Resumen</p>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600">Ensalada {tamano.nombre}</span>
                    <span className="font-semibold text-gray-900">{formatMXN(tamano.precio)}</span>
                  </div>
                  {topsBase.length > 0 && (
                    <div className="text-[12px] text-gray-500">{topsBase.map(t => t.nombre).join(', ')}</div>
                  )}
                  {topsEspeciales.map(t => (
                    <div key={t.id} className="flex justify-between text-[13px]">
                      <span className="text-gray-600">{t.nombre}</span>
                      <span className="font-semibold text-gray-900">+{formatMXN(t.precio_extra)}</span>
                    </div>
                  ))}
                  {aderezo && (
                    <div className="text-[12px] text-gray-500">Aderezo: {aderezo.nombre}</div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-[15px] font-bold text-gray-900">Total</span>
                    <span className="text-[17px] font-extrabold text-brand-primary">{formatMXN(precioTotal)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => paso === 0 ? onClose() : setPaso(p => p - 1)}
            className="px-4 py-2.5 rounded-lg border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {paso === 0 ? 'Cancelar' : 'Atrás'}
          </button>

          {paso < PASOS.length - 1 ? (
            <button
              onClick={() => setPaso(p => p + 1)}
              disabled={!puedeAvanzar}
              className="flex-1 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-primary-dark text-white text-[13px] font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={confirmar}
              disabled={!aderezo}
              className="flex-1 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-primary-dark text-white text-[13px] font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Agregar al pedido — {formatMXN(precioTotal)}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
