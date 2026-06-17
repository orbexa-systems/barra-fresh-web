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

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <BenefitsSection />
        <MenuSection />
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
