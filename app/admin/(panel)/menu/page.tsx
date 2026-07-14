import { getAllProductosAdmin } from '@/lib/data/productos'
import { getAllCategoriasAdmin } from '@/lib/data/categorias'
import { MenuPageClient } from './MenuPageClient'

export default async function MenuAdminPage() {
  const [productos, categorias] = await Promise.all([
    getAllProductosAdmin(),
    getAllCategoriasAdmin(),
  ])

  return (
    <div className="max-w-5xl">
      <MenuPageClient productos={productos} categorias={categorias} />
    </div>
  )
}
