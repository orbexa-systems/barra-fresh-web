import Image from 'next/image'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { Button } from '@/components/ui/Button'
import { BUSINESS_INFO } from '@/lib/data'

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-green-50 via-white to-lime-50"
    >
      {/* Background decorative circles */}
      <div
        className="absolute top-20 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 bg-lime-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-6">
              <span aria-hidden="true">🌿</span>
              Comida saludable en {BUSINESS_INFO.city.split(',')[0]}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Alimentación{' '}
              <span className="text-green-600 relative">
                saludable
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 6 C50 2, 150 2, 200 6"
                    stroke="#16a34a"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              para tu día
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Ensaladas frescas, jugos naturales, licuados nutritivos y yogurt preparado
              con ingredientes seleccionados. ¡Prueba la diferencia de comer bien!
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-500 font-medium">Natural</p>
              </div>
              <div className="w-px h-10 bg-gray-200" aria-hidden="true" />
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">+20</p>
                <p className="text-xs text-gray-500 font-medium">Opciones</p>
              </div>
              <div className="w-px h-10 bg-gray-200" aria-hidden="true" />
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">⭐ 5.0</p>
                <p className="text-xs text-gray-500 font-medium">Calificación</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button href="#menu" variant="primary" size="lg">
                <span aria-hidden="true">🍽️</span>
                Ver Menú
              </Button>
              <Button href="/menu" variant="outline" size="lg">
                <span aria-hidden="true">📋</span>
                Menú Digital
              </Button>
              <WhatsAppButton
                label="Ordenar por WhatsApp"
                size="lg"
                message="Hola BarraFresh, me gustaría hacer un pedido."
              />
            </div>
          </div>

          {/* Hero Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80"
                    alt="Ensalada fresca con vegetales coloridos"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority
                  />
                </div>
                <div className="relative h-36 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80"
                    alt="Jugo verde natural detox"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="relative h-36 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80"
                    alt="Yogurt parfait con frutos rojos"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80"
                    alt="Smoothie bowl de açaí"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg" aria-hidden="true">
                🥗
              </div>
              <div>
                <p className="text-xs text-gray-500">Ingredientes</p>
                <p className="text-sm font-bold text-gray-900">100% Frescos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path
            d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
