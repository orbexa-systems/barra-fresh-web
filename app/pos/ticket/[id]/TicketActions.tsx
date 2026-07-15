'use client'

export function TicketActions() {
  return (
    <div className="no-print fixed bottom-6 right-6 flex gap-3">
      <button
        onClick={() => window.print()}
        className="h-11 px-5 rounded-lg bg-gray-900 text-white text-[13px] font-semibold shadow-lg hover:bg-gray-800 transition-colors"
      >
        Imprimir
      </button>
      <button
        onClick={() => window.close()}
        className="h-11 px-5 rounded-lg bg-white border border-gray-200 text-gray-700 text-[13px] font-semibold shadow-lg hover:bg-gray-50 transition-colors"
      >
        Cerrar
      </button>
    </div>
  )
}
