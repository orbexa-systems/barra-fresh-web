import { BUSINESS_INFO } from '@/lib/data'
import { buildDirectionsUrl, buildWhatsAppUrl } from '@/lib/whatsapp'

export function LocationSection() {
  const mapsUrl = buildDirectionsUrl(BUSINESS_INFO.address)

  return (
    <section id="ubicacion" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-surface-mid text-brand-primary-dark text-sm font-semibold mb-4">
            Ubicación
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Visítanos o{' '}
            <span className="text-brand-primary">pide a domicilio</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos en el corazón de la ciudad, listos para servirte con la mejor
            comida saludable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Info Cards */}
          <div className="space-y-5">
            {/* Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
              <div className="w-12 h-12 bg-brand-surface-mid rounded-xl flex items-center justify-center flex-shrink-0 text-xl" aria-hidden="true">
                📍
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Dirección</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {BUSINESS_INFO.address}
                  <br />
                  {BUSINESS_INFO.city}
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-primary hover:text-brand-primary-dark text-sm font-medium mt-2 transition-colors duration-200 focus:outline-none focus-visible:underline"
                  aria-label="Ver ruta en Google Maps"
                >
                  Ver en Google Maps
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
              <div className="w-12 h-12 bg-brand-surface-mid rounded-xl flex items-center justify-center flex-shrink-0 text-xl" aria-hidden="true">
                📞
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Teléfono</h3>
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="text-gray-600 text-sm hover:text-brand-primary transition-colors duration-200 focus:outline-none focus-visible:underline"
                  aria-label={`Llamar al ${BUSINESS_INFO.phone}`}
                >
                  {BUSINESS_INFO.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
              <div className="w-12 h-12 bg-brand-surface-mid rounded-xl flex items-center justify-center flex-shrink-0 text-xl" aria-hidden="true">
                ✉️
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Correo Electrónico</h3>
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="text-gray-600 text-sm hover:text-brand-primary transition-colors duration-200 focus:outline-none focus-visible:underline"
                  aria-label={`Enviar email a ${BUSINESS_INFO.email}`}
                >
                  {BUSINESS_INFO.email}
                </a>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
              <div className="w-12 h-12 bg-brand-surface-mid rounded-xl flex items-center justify-center flex-shrink-0 text-xl" aria-hidden="true">
                🕐
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-3">Horarios</h3>
                <ul className="space-y-2">
                  {BUSINESS_INFO.schedule.map((s, i) => (
                    <li key={i} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{s.days}</span>
                      <span className="font-semibold text-brand-primary bg-brand-surface px-3 py-0.5 rounded-full text-xs">
                        {s.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light focus-visible:ring-offset-2"
                aria-label="Obtener indicaciones en Google Maps"
              >
                <span aria-hidden="true">🗺️</span>
                Cómo llegar
              </a>
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-semibold text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light focus-visible:ring-offset-2"
                aria-label={`Llamar al ${BUSINESS_INFO.phone}`}
              >
                <span aria-hidden="true">📞</span>
                Llamar ahora
              </a>
            </div>
          </div>

          {/* Google Maps embed */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-full min-h-[400px]">
            <iframe
              src="https://maps.google.com/maps?q=Calle+Lirio+20,+Lomas+de+San+Miguel,+Atizap%C3%A1n+de+Zaragoza,+Estado+de+M%C3%A9xico,+52928&output=embed&z=16"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación BarraFresh"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
