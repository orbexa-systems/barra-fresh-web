import { BUSINESS_INFO } from '@/lib/data'

const BASE_URL = 'https://wa.me'

export function buildWhatsAppUrl(message?: string): string {
  const text = message ?? 'Hola, me gustaría conocer el menú de BarraFresh.'
  const encoded = encodeURIComponent(text)
  return `${BASE_URL}/${BUSINESS_INFO.whatsapp}?text=${encoded}`
}

export function buildOrderUrl(productName: string): string {
  const message = `Hola BarraFresh, me gustaría ordenar: ${productName}. ¿Está disponible?`
  return buildWhatsAppUrl(message)
}

export function buildDirectionsUrl(address: string): string {
  const encoded = encodeURIComponent(`${address}, ${BUSINESS_INFO.city}`)
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`
}
