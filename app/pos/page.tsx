import { getCategorias } from '@/lib/data/categorias'
import { getProductos } from '@/lib/data/productos'
import { getTamanos, getToppings, getAderezos } from '@/lib/data/configurador'
import { POSClient } from './POSClient'

export default async function POSPage() {
  const [categorias, productos, tamanos, toppings, aderezos] = await Promise.all([
    getCategorias(),
    getProductos(),
    getTamanos(),
    getToppings(),
    getAderezos(),
  ])

  return (
    <POSClient
      categorias={categorias}
      productos={productos}
      tamanos={tamanos}
      toppings={toppings}
      aderezos={aderezos}
    />
  )
}
