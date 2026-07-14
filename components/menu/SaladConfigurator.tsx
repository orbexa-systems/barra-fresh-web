'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/components/menu/CartContext'
import type { TamanoEnsalada, Topping, Aderezo } from '@/lib/data/configurador'

interface Props {
  tamanos: TamanoEnsalada[]
  toppings: Topping[]
  aderezos: Aderezo[]
}

const SIZE_PHOTOS = [
  { photo: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&q=80', size: 'w-10 h-10', badge: null },
  { photo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&q=80', size: 'w-14 h-14', badge: 'Más popular' },
  { photo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&q=80', size: 'w-16 h-16', badge: null },
]

export function SaladConfigurator({ tamanos, toppings, aderezos }: Props) {
  const { addItem } = useCart()
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [selectedAderezo, setSelectedAderezo] = useState<string | null>(null)
  const [selectedSpecials, setSelectedSpecials] = useState<string[]>([])
  const [justAdded, setJustAdded] = useState(false)

  const toppingsBase = toppings.filter(t => t.tipo === 'base')
  const toppingsEspeciales = toppings.filter(t => t.tipo === 'especial')

  const size = tamanos.find(s => s.id === selectedSizeId) ?? null

  const specialCost = selectedSpecials.reduce((sum, id) => {
    const sp = toppingsEspeciales.find(t => t.id === id)
    return sum + (sp?.precio_extra ?? 0)
  }, 0)
  const total = (size?.precio ?? 0) + specialCost

  function handleSizeChange(id: string) {
    const newSize = tamanos.find(s => s.id === id)!
    setSelectedSizeId(id)
    if (selectedToppings.length > newSize.max_toppings) {
      setSelectedToppings(prev => prev.slice(0, newSize.max_toppings))
    }
  }

  function toggleTopping(nombre: string) {
    if (!size) return
    setSelectedToppings(prev => {
      if (prev.includes(nombre)) return prev.filter(t => t !== nombre)
      if (prev.length >= size.max_toppings) return prev
      return [...prev, nombre]
    })
  }

  function toggleSpecial(id: string) {
    setSelectedSpecials(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  function buildDetail(): string {
    const lines: string[] = []
    if (selectedToppings.length > 0) lines.push(`Toppings: ${selectedToppings.join(', ')}`)
    if (selectedAderezo) lines.push(`Aderezo: ${selectedAderezo}`)
    if (selectedSpecials.length > 0) {
      const text = selectedSpecials.map(id => {
        const sp = toppingsEspeciales.find(t => t.id === id)!
        return `${sp.nombre} (+${formatPrice(sp.precio_extra)})`
      }).join(', ')
      lines.push(`Extras: ${text}`)
    }
    return lines.join('\n')
  }

  function handleAddToCart() {
    if (!size) return
    addItem({
      name: `Ensalada ${size.nombre}`,
      price: total,
      detail: buildDetail(),
    })
    setSelectedSizeId(null)
    setSelectedToppings([])
    setSelectedAderezo(null)
    setSelectedSpecials([])
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }

  return (
    <div className="col-span-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-brand-surface border-b border-brand-surface-mid px-6 py-4 flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">🥗</span>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Arma tu Ensalada</h3>
          <p className="text-sm text-gray-500">Elige tamaño, agrega toppings y personalízala a tu gusto</p>
        </div>
      </div>

      <div className="p-6 space-y-7">
        {/* Paso 1: Tamaño */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            1. Elige el tamaño
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {tamanos.map((s, i) => {
              const active = selectedSizeId === s.id
              const cfg = SIZE_PHOTOS[i] ?? SIZE_PHOTOS[0]
              return (
                <button
                  key={s.id}
                  onClick={() => handleSizeChange(s.id)}
                  className={`relative flex-1 flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light ${
                    active
                      ? 'border-brand-primary-light bg-brand-surface shadow-md'
                      : 'border-gray-200 bg-white hover:border-brand-primary-subtle hover:shadow-sm'
                  }`}
                >
                  {cfg.badge && (
                    <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-brand-accent text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">
                      {cfg.badge}
                    </span>
                  )}
                  <div className={`shrink-0 rounded-full overflow-hidden shadow-md ring-2 ${active ? 'ring-green-400' : 'ring-gray-100'} transition-all ${cfg.size}`}>
                    <Image
                      src={cfg.photo}
                      alt={`Ensalada ${s.nombre}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-base ${active ? 'text-brand-primary-dark' : 'text-gray-800'}`}>
                      {s.nombre}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">hasta {s.max_toppings} toppings</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className={`text-xl font-extrabold ${active ? 'text-brand-primary' : 'text-gray-700'}`}>
                      {formatPrice(s.precio)}
                    </span>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      active ? 'bg-brand-primary-light border-brand-primary-light' : 'border-gray-300'
                    }`}>
                      {active && (
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" aria-hidden="true">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Paso 2: Toppings incluidos */}
        {size && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                2. Toppings incluidos
              </p>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                selectedToppings.length >= size.max_toppings
                  ? 'bg-brand-surface-mid text-brand-primary-dark'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {selectedToppings.length}/{size.max_toppings}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {toppingsBase.map(topping => {
                const selected = selectedToppings.includes(topping.nombre)
                const disabled = !selected && selectedToppings.length >= size.max_toppings
                return (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping.nombre)}
                    disabled={disabled}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light ${
                      selected
                        ? 'bg-brand-primary text-white shadow-sm'
                        : disabled
                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-600 hover:bg-brand-surface-mid hover:text-brand-primary-dark'
                    }`}
                  >
                    {topping.nombre}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Paso 3: Aderezo */}
        {size && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              3. Elige tu aderezo
            </p>
            <div className="flex flex-wrap gap-2">
              {aderezos.map(aderezo => {
                const active = selectedAderezo === aderezo.nombre
                return (
                  <button
                    key={aderezo.id}
                    onClick={() => setSelectedAderezo(active ? null : aderezo.nombre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light ${
                      active
                        ? 'bg-brand-primary border-brand-primary text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-brand-primary-subtle hover:text-brand-primary-dark'
                    }`}
                  >
                    {aderezo.nombre}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Paso 4: Toppings especiales */}
        {size && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                4. Toppings especiales
              </p>
              <span className="text-xs text-gray-400">(costo adicional)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {toppingsEspeciales.map(sp => {
                const selected = selectedSpecials.includes(sp.id)
                return (
                  <button
                    key={sp.id}
                    onClick={() => toggleSpecial(sp.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                      selected
                        ? 'bg-brand-accent-dark border-brand-accent-dark text-white shadow-sm'
                        : 'bg-brand-accent-surface border-brand-accent-border text-brand-accent-text hover:bg-brand-accent-surface'
                    }`}
                  >
                    {sp.nombre}
                    <span className={`text-xs font-bold ${selected ? 'text-brand-accent-surface' : 'text-brand-accent-dark'}`}>
                      +{formatPrice(sp.precio_extra)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer: total + botón */}
        <div className={`-mx-6 -mb-6 px-6 py-5 flex items-center justify-between transition-colors duration-300 ${
          size ? 'bg-brand-primary' : 'bg-gray-50 border-t border-gray-100'
        }`}>
          {size ? (
            <p className="text-sm text-brand-primary-muted">Selecciona tus opciones</p>
          ) : (
            <p className="text-sm text-gray-400">Selecciona un tamaño para comenzar</p>
          )}
          <div className="flex items-center gap-3">
            {size && (
              <div className="text-right">
                <p className="text-xs text-brand-primary-muted font-medium leading-none mb-0.5">Total estimado</p>
                <p className="text-2xl font-extrabold text-white leading-none">{formatPrice(total)}</p>
              </div>
            )}
            <button
              onClick={handleAddToCart}
              disabled={!size}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${
                justAdded
                  ? 'bg-emerald-400 text-white cursor-default'
                  : size
                  ? 'bg-white text-brand-primary-dark hover:bg-brand-surface shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {justAdded ? (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Agregada
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                    <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Agregar al pedido
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
