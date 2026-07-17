import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { MenuSection } from '@/components/sections/MenuSection'
import { GallerySection } from '@/components/sections/GallerySection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { LocationSection } from '@/components/sections/LocationSection'
import { OrderSection } from '@/components/sections/OrderSection'
import { WhatsAppFloatingButton } from '@/components/ui/WhatsAppButton'

export const dynamic = 'force-dynamic'

function MenuSectionSkeleton() {
  return (
    <section className="py-16 bg-brand-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-3">
          <div className="h-6 w-28 bg-gray-200 rounded-full mx-auto animate-pulse" />
          <div className="h-9 w-56 bg-gray-200 rounded-xl mx-auto animate-pulse" />
        </div>
        <div className="flex gap-2 mb-8 overflow-hidden">
          {[80, 96, 72, 88, 64].map((w, i) => (
            <div key={i} style={{ width: w }} className="h-9 rounded-full bg-gray-200 animate-pulse shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <BenefitsSection />
        <Suspense fallback={<MenuSectionSkeleton />}>
          <MenuSection />
        </Suspense>
        <GallerySection />
        <TestimonialsSection />
        <OrderSection />
        <LocationSection />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  )
}
