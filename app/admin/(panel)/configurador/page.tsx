import { getAllTamanosAdmin, getAllToppingsAdmin, getAllAderezosAdmin } from '@/lib/data/configurador'
import { TamanosPanel } from './TamanosPanel'
import { ToppingsPanel } from './ToppingsPanel'
import { AderezosPanel } from './AderezosPanel'

export default async function ConfiguradorAdminPage() {
  const [tamanos, toppings, aderezos] = await Promise.all([
    getAllTamanosAdmin(),
    getAllToppingsAdmin(),
    getAllAderezosAdmin(),
  ])

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Configurador</h1>
        <p className="text-sm text-gray-500 mt-1">
          {tamanos.length} tamaños · {toppings.length} toppings · {aderezos.length} aderezos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <TamanosPanel tamanos={tamanos} />
        </div>
        <ToppingsPanel toppings={toppings} />
        <AderezosPanel aderezos={aderezos} />
      </div>
    </div>
  )
}
