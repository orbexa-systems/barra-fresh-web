'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { deleteProducto } from '@/app/admin/(panel)/menu/actions'
import type { Producto } from '@/lib/data/productos'
import type { Categoria } from '@/lib/data/categorias'

interface Props {
  open: boolean
  onClose: () => void
  producto: Producto | null
  categorias: Categoria[]
  action: (formData: FormData) => Promise<void>
}

export function ProductDrawer({ open, onClose, producto, categorias, action }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [deleting, startDelete] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Sync preview with editing product
  useEffect(() => {
    setPreview(producto?.imagen_url ?? null)
    setError(null)
  }, [producto, open])

  // Escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function handleFile(file: File) {
    if (file.size > 2 * 1024 * 1024) { setError('La imagen no puede superar 2MB.'); return }
    setPreview(URL.createObjectURL(file))
    if (fileRef.current) {
      const dt = new DataTransfer()
      dt.items.add(file)
      fileRef.current.files = dt.files
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await action(formData)
        onClose()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al guardar el producto.')
      }
    })
  }

  function handleDelete() {
    if (!producto) return
    if (!confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return
    startDelete(async () => {
      await deleteProducto(producto.id)
      onClose()
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="relative z-10 w-full max-w-[480px] bg-white h-full flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <h2 id="drawer-title" className="text-base font-semibold text-gray-900">
            {producto ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-6">

            {/* Información básica */}
            <section>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Información básica
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nombre del producto <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="nombre"
                    required
                    defaultValue={producto?.nombre}
                    placeholder="Ej. Verde Detox"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                  <textarea
                    name="descripcion"
                    rows={3}
                    defaultValue={producto?.descripcion ?? ''}
                    placeholder="Ingredientes o descripción breve del producto"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Categoría <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="categoria_id"
                    required
                    defaultValue={producto?.categoria_id ?? ''}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Precio y estado */}
            <section>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Precio y disponibilidad
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Precio <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
                    <input
                      name="precio"
                      type="number"
                      required
                      min={0}
                      step={0.01}
                      defaultValue={producto?.precio}
                      placeholder="0.00"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>

                <input name="orden" type="hidden" defaultValue={producto?.orden ?? 0} />

                <div className="flex flex-col gap-3 pt-1">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      name="disponible"
                      type="checkbox"
                      defaultChecked={producto ? producto.disponible : true}
                      className="mt-0.5 w-4 h-4 rounded text-brand-primary focus:ring-brand-primary/20 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Disponible en el menú</p>
                      <p className="text-xs text-gray-400 mt-0.5">El producto aparece en el sitio público y se puede ordenar.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      name="destacado"
                      type="checkbox"
                      defaultChecked={producto?.destacado ?? false}
                      className="mt-0.5 w-4 h-4 rounded text-brand-primary focus:ring-brand-primary/20 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Producto destacado</p>
                      <p className="text-xs text-gray-400 mt-0.5">Aparece en la sección de destacados del landing page.</p>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* Imagen */}
            <section>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Imagen</p>

              <input
                ref={fileRef}
                name="imagen"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />

              {preview ? (
                <div className="relative">
                  <div className="relative h-48 rounded-xl overflow-hidden border border-gray-200">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized={preview.startsWith('blob:')}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = '' }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-gray-500 hover:text-red-500 hover:bg-white shadow-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-2 w-full text-xs text-gray-400 hover:text-gray-600 text-center transition-colors"
                  >
                    Cambiar imagen
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={e => {
                    e.preventDefault()
                    setDragging(false)
                    const file = e.dataTransfer.files[0]
                    if (file && file.type.startsWith('image/')) handleFile(file)
                  }}
                  className={`flex flex-col items-center justify-center gap-3 h-40 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                    dragging
                      ? 'border-brand-primary bg-brand-surface'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    dragging ? 'bg-brand-surface-mid' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-5 h-5 ${dragging ? 'text-brand-primary' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      {dragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">JPG o PNG · máx. 2MB · recomendado 400×400px</p>
                  </div>
                </div>
              )}
            </section>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center shrink-0">
          {producto && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
            >
              {deleting ? 'Eliminando…' : 'Eliminar producto'}
            </button>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form={undefined}
              onClick={() => formRef.current?.requestSubmit()}
              disabled={pending}
              className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-60"
            >
              {pending ? 'Guardando…' : 'Guardar producto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
