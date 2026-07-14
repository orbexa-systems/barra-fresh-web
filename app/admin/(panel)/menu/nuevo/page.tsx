import Link from 'next/link'
import { getCategorias } from '@/lib/data/categorias'
import { ProductForm } from '@/components/admin/ProductForm'
import { createProducto } from '../actions'

export default async function NuevoProductoPage() {
  const categorias = await getCategorias()

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/menu" className="text-sm text-gray-400 hover:text-gray-600 mb-2 inline-block">
          ← Volver al menú
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <ProductForm categorias={categorias} action={createProducto} />
      </div>
    </div>
  )
}
