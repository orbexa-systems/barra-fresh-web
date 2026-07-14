import { getPedidos } from '@/lib/data/pedidos'
import { PedidosClient } from './PedidosClient'

export default async function PedidosAdminPage() {
  const pedidos = await getPedidos()

  return (
    <div className="max-w-6xl">
      <PedidosClient pedidos={pedidos} />
    </div>
  )
}
