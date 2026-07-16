'use client'

import { useEffect } from 'react'

export default function POSError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-sm bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">No se pudo cargar el menú</h2>
        <p className="text-sm text-gray-500 mb-6">
          Verifica tu conexión a internet e intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="w-full py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-semibold transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
