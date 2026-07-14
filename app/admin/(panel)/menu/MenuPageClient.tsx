'use client'

import { useState } from 'react'
import { CategoryFilter } from '@/components/admin/CategoryFilter'
import { CategoryModal } from '@/components/admin/CategoryModal'
import { ProductDrawer } from '@/components/admin/ProductDrawer'
import { ProductList } from './ProductList'
import { createProducto, updateProducto } from './actions'
import type { Producto } from '@/lib/data/productos'
import type { Categoria } from '@/lib/data/categorias'

interface Props {
  productos: Producto[]
  categorias: Categoria[]
}

export function MenuPageClient({ productos, categorias }: Props) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null)
  const [catModalOpen, setCatModalOpen] = useState(false)

  function openCreate() {
    setEditingProducto(null)
    setDrawerOpen(true)
  }

  function openEdit(p: Producto) {
    setEditingProducto(p)
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
    setEditingProducto(null)
  }

  const drawerAction = editingProducto
    ? updateProducto.bind(null, editingProducto.id)
    : createProducto

  return (
    <>
      {/* Page header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Menú</h1>
          <p className="text-sm text-gray-500 mt-1">
            {productos.length} productos · {categorias.length} categorías
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo producto
        </button>
      </div>

      <CategoryFilter
        categorias={categorias.filter(c => c.activo)}
        selected={selectedCat}
        onSelect={setSelectedCat}
        onManage={() => setCatModalOpen(true)}
      />

      <ProductList
        productos={productos}
        categorias={categorias}
        selectedCat={selectedCat}
        onEdit={openEdit}
        onAdd={openCreate}
      />

      <ProductDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        producto={editingProducto}
        categorias={categorias.filter(c => c.activo)}
        action={drawerAction}
      />

      <CategoryModal
        open={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        categorias={categorias}
      />
    </>
  )
}
