'use client'

import { useState } from 'react'
import { SALAD_SIZES, SALAD_TOPPINGS, SALAD_SPECIAL_TOPPINGS } from '@/lib/data'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/utils'

const WHATSAPP_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export function SaladConfigurator() {
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [selectedSpecials, setSelectedSpecials] = useState<string[]>([])

  const size = SALAD_SIZES.find(s => s.id === selectedSizeId) ?? null

  const specialCost = selectedSpecials.reduce((sum, id) => {
    const s = SALAD_SPECIAL_TOPPINGS.find(sp => sp.id === id)
    return sum + (s?.price ?? 0)
  }, 0)
  const total = (size?.price ?? 0) + specialCost

  function handleSizeChange(id: string) {
    const newSize = SALAD_SIZES.find(s => s.id === id)!
    setSelectedSizeId(id)
    if (selectedToppings.length > newSize.maxToppings) {
      setSelectedToppings(prev => prev.slice(0, newSize.maxToppings))
    }
  }

  function toggleTopping(topping: string) {
    if (!size) return
    setSelectedToppings(prev => {
      if (prev.includes(topping)) return prev.filter(t => t !== topping)
      if (prev.length >= size.maxToppings) return prev
      return [...prev, topping]
    })
  }

  function toggleSpecial(id: string) {
    setSelectedSpecials(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  function buildOrderMessage(): string {
    const lines = [
      'Hola BarraFresh 🥗 Quiero ordenar:',
      '',
      `Ensalada ${size!.label} — ${formatPrice(size!.price)}`,
    ]
    lines.push(
      `Toppings (${selectedToppings.length}/${size!.maxToppings}): ${
        selectedToppings.length > 0 ? selectedToppings.join(', ') : 'ninguno aún'
      }`
    )
    if (selectedSpecials.length > 0) {
      const text = selectedSpecials.map(id => {
        const sp = SALAD_SPECIAL_TOPPINGS.find(s => s.id === id)!
        return `${sp.label} (+${formatPrice(sp.price)})`
      }).join(', ')
      lines.push(`Toppings especiales: ${text}`)
    }
    lines.push('', `Total estimado: ${formatPrice(total)}`, '', '¿Está disponible?')
    return lines.join('\n')
  }

  const orderUrl = size ? buildWhatsAppUrl(buildOrderMessage()) : '#'

  return (
    <div className="col-span-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-green-50 border-b border-green-100 px-6 py-4 flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">🥗</span>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Arma tu Ensalada</h3>
          <p className="text-sm text-gray-500">Elige tamaño, agrega toppings y personalízala a tu gusto</p>
        </div>
      </div>

      <div className="p-6 space-y-7">
        {/* Paso 1: Tamaño */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            1. Elige el tamaño
          </p>
          <div className="grid grid-cols-3 gap-3">
            {SALAD_SIZES.map(s => (
              <button
                key={s.id}
                onClick={() => handleSizeChange(s.id)}
                className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                  selectedSizeId === s.id
                    ? 'border-green-500 bg-green-50 shadow-sm'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                }`}
              >
                <span className="text-xl" aria-hidden="true">
                  {s.id === 'chica' ? '🥗' : s.id === 'mediana' ? '🥗🥗' : '🥗🥗🥗'}
                </span>
                <span className="font-bold text-gray-900 text-sm">{s.label}</span>
                <span className="text-green-600 font-extrabold text-lg leading-none">
                  {formatPrice(s.price)}
                </span>
                <span className="text-xs text-gray-400">hasta {s.maxToppings} toppings</span>
              </button>
            ))}
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
                selectedToppings.length >= size.maxToppings
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {selectedToppings.length}/{size.maxToppings}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SALAD_TOPPINGS.map(topping => {
                const selected = selectedToppings.includes(topping)
                const disabled = !selected && selectedToppings.length >= size.maxToppings
                return (
                  <button
                    key={topping}
                    onClick={() => toggleTopping(topping)}
                    disabled={disabled}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                      selected
                        ? 'bg-green-600 text-white shadow-sm'
                        : disabled
                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                    }`}
                  >
                    {topping}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Paso 3: Toppings especiales */}
        {size && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                3. Toppings especiales
              </p>
              <span className="text-xs text-gray-400">(costo adicional)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SALAD_SPECIAL_TOPPINGS.map(sp => {
                const selected = selectedSpecials.includes(sp.id)
                return (
                  <button
                    key={sp.id}
                    onClick={() => toggleSpecial(sp.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      selected
                        ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                        : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    {sp.label}
                    <span className={`text-xs font-bold ${selected ? 'text-amber-100' : 'text-amber-500'}`}>
                      +{formatPrice(sp.price)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer: total + botón */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          <div>
            {size ? (
              <>
                <p className="text-xs text-gray-400 mb-0.5">Total estimado</p>
                <p className="text-2xl font-extrabold text-green-600">{formatPrice(total)}</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Selecciona un tamaño para comenzar</p>
            )}
          </div>
          <a
            href={size ? orderUrl : undefined}
            target={size ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-disabled={!size}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
              size
                ? 'bg-green-600 hover:bg-green-700 shadow-sm hover:shadow-md'
                : 'bg-gray-200 cursor-not-allowed pointer-events-none'
            }`}
          >
            {WHATSAPP_ICON}
            Ordenar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
