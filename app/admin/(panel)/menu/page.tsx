import Link from 'next/link'
import { getAllProductosAdmin } from '@/lib/data/productos'
import { getAllCategoriasAdmin } from '@/lib/data/categorias'
import { ProductTable } from './ProductTable'
import { CategoryManager } from '@/components/admin/CategoryManager'

export default async function MenuAdminPage() {
  const [productos, categorias] = await Promise.all([
    getAllProductosAdmin(),
    getAllCategoriasAdmin(),
  ])

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menú</h1>
          <p className="text-sm text-gray-400 mt-1">{productos.length} productos · {categorias.length} categorías</p>
        </div>
        <Link
          href="/admin/menu/nuevo"
          className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-semibold transition-colors"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductTable productos={productos} categorias={categorias} />
        </div>
        <div>
          <CategoryManager categorias={categorias} />
        </div>
      </div>
    </div>
  )
}
