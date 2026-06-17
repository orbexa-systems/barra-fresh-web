import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

export function OrderSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
          {/* Decoration */}
          <div
            className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 bg-green-800 rounded-full blur-2xl opacity-30 -translate-x-1/2 translate-y-1/2"
            aria-hidden="true"
          />

          <div className="relative">
            <span className="inline-block text-4xl mb-4" aria-hidden="true">📲</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¿Listo para ordenar?
            </h2>
            <p className="text-green-100 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Haz tu pedido fácil y rápido por WhatsApp. Te atendemos en minutos
              con ingredientes frescos del día.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppButton
                label="Hacer mi pedido"
                size="lg"
                message="Hola BarraFresh, me gustaría hacer un pedido. ¿Podrían ayudarme?"
                className="bg-white text-green-700 hover:bg-green-50 font-bold px-8 py-4 text-lg rounded-xl shadow-lg"
              />
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white text-white hover:bg-white/10 font-semibold text-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span aria-hidden="true">🍽️</span>
                Ver Menú
              </a>
            </div>

            <p className="text-green-200 text-sm mt-6">
              Tiempo de respuesta promedio: menos de 5 minutos
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
