import { BENEFITS } from '@/lib/data'

export function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
            ¿Por qué elegirnos?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            La diferencia <span className="text-green-600">BarraFresh</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nos comprometemos con tu salud y bienestar ofreciendo lo mejor en
            cada preparación.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit) => (
            <article
              key={benefit.id}
              className="group bg-gray-50 hover:bg-green-50 rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div
                className="w-14 h-14 bg-white group-hover:bg-green-100 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-sm transition-colors duration-300"
                aria-hidden="true"
              >
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
