import { TESTIMONIALS } from '@/lib/data'
import { StarRating } from '@/components/ui/StarRating'

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-green-600 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-0 left-0 w-72 h-72 bg-green-500 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 bg-green-700 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-4">
            Testimonios
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex" aria-label="Calificación promedio: 5 de 5 estrellas">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-400" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-white/90 text-sm font-medium">4.9 promedio · +200 reseñas</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
            >
              {/* Quote icon */}
              <svg
                className="w-8 h-8 text-white/30 mb-4"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
              </svg>

              <p className="text-white/90 text-sm leading-relaxed mb-5">
                "{testimonial.comment}"
              </p>

              <footer className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full bg-green-400 flex items-center justify-center text-white font-bold text-sm"
                    aria-hidden="true"
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                    <time
                      className="text-white/60 text-xs"
                      dateTime={testimonial.date}
                    >
                      {new Date(testimonial.date).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </time>
                  </div>
                </div>
                <StarRating rating={testimonial.rating} />
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
