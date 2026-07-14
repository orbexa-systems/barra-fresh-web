import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductoById } from '@/lib/data/productos'
import { getCategorias } from '@/lib/data/categorias'
import { ProductForm } from '@/components/admin/ProductForm'
import { updateProducto } from '../../actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params
  const [producto, categorias] = await Promise.all([
    getProductoById(id),
    getCategorias(),
  ])

  if (!producto) notFound()

  const boundUpdate = updateProducto.bind(null, id)

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/menu" className="text-sm text-gray-400 hover:text-gray-600 mb-2 inline-block">
          ← Volver al menú
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
        <p className="text-sm text-gray-400 mt-1">{producto.nombre}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <ProductForm categorias={categorias} producto={producto} action={boundUpdate} />
      </div>
    </div>
  )
}
