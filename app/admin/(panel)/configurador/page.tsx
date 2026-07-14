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
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurador de ensaladas</h1>
        <p className="text-sm text-gray-400 mt-1">Gestiona los tamaños, toppings y aderezos que el cliente puede elegir.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tamaños — ocupa todo el ancho arriba */}
        <div className="lg:col-span-2">
          <TamanosPanel tamanos={tamanos} />
        </div>

        {/* Toppings + Aderezos lado a lado */}
        <ToppingsPanel toppings={toppings} />
        <AderezosPanel aderezos={aderezos} />
      </div>
    </div>
  )
}
