# BarraFresh — Referencia del Proyecto

## Resumen

Landing page + menú digital para **BarraFresh**, negocio de comida saludable (ensaladas, jugos, licuados, smoothies, yogurt, snacks).

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Sin base de datos (datos en archivo estático)

**Ejecutar:**
```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # build de producción
```

---

## Estructura de carpetas

```
barra_fresh_proyecto/
├── app/
│   ├── layout.tsx          # Root layout: metadata SEO, JSON-LD, fuente Inter
│   ├── page.tsx            # Página principal: composición de todas las secciones
│   ├── globals.css         # Tailwind v4 import, scroll suave, focus styles
│   ├── sitemap.ts          # Sitemap automático (Next.js MetadataRoute)
│   └── robots.ts           # Robots.txt con reglas
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Header sticky, scroll-aware, menú móvil animado
│   │   └── Footer.tsx      # Logo, nav, horarios, contacto, redes sociales
│   ├── sections/
│   │   ├── HeroSection.tsx         # Hero con grid de imágenes, stats, CTAs
│   │   ├── BenefitsSection.tsx     # 4 tarjetas de beneficios con hover
│   │   ├── MenuSection.tsx         # Menú filtrable por categoría ('use client')
│   │   ├── GallerySection.tsx      # Galería masonry con lazy loading
│   │   ├── TestimonialsSection.tsx # 6 testimonios sobre fondo verde
│   │   ├── OrderSection.tsx        # CTA de pedido por WhatsApp
│   │   └── LocationSection.tsx     # Dirección, horarios, placeholder Maps
│   └── ui/
│       ├── Button.tsx              # 5 variantes, 3 tamaños, soporte href/anchor
│       ├── WhatsAppButton.tsx      # Botón inline + botón flotante (FAB)
│       └── StarRating.tsx          # Rating visual con SVG, accesible
│
├── lib/
│   ├── data.ts             # FUENTE ÚNICA DE DATOS (productos, categorías, etc.)
│   ├── whatsapp.ts         # Helpers: buildWhatsAppUrl, buildOrderUrl, buildDirectionsUrl
│   └── utils.ts            # formatPrice (MXN), cn (classnames)
│
├── types/
│   └── index.ts            # Interfaces TypeScript: Product, Testimonial, BusinessInfo, etc.
│
├── public/
│   ├── images/             # (vacío — imágenes vienen de Unsplash por ahora)
│   └── icons/              # (vacío — pendiente favicon, og-image, apple-touch-icon)
│
├── next.config.ts          # remotePatterns Unsplash, avif/webp, sin powered-by header
└── REFERENCIA.md           # Este archivo
```

---

## Datos del negocio — dónde cambiarlos

Todo está centralizado en **`lib/data.ts`**. Nunca hay datos hardcodeados en componentes.

### `BUSINESS_INFO`
```ts
// lib/data.ts
export const BUSINESS_INFO: BusinessInfo = {
  name: 'BarraFresh',
  phone: '+527771234567',       // ← cambiar al real
  whatsapp: '527771234567',     // ← sin + ni espacios
  email: 'contacto@barrafresh.mx',
  address: 'Av. Saludable 123, Col. Centro',
  city: 'Cuernavaca, Morelos',
  schedule: [...],
  socialMedia: {
    instagram: 'https://instagram.com/barrafresh',
    facebook:  'https://facebook.com/barrafresh',
    tiktok:    'https://tiktok.com/@barrafresh',
  },
}
```

### Agregar un producto nuevo
```ts
// lib/data.ts → array PRODUCTS
{
  id: 'ens-005',
  name: 'Nombre del producto',
  description: 'Descripción corta',
  price: 90,
  image: 'https://...',
  category: 'ensaladas',   // ver ProductCategory en types/index.ts
  featured: true,           // opcional — aparece con badge "Popular"
  tags: ['vegano'],         // opcional — muestra el primero como chip
}
```

### Categorías disponibles (`ProductCategory` en `types/index.ts`)
`'ensaladas' | 'jugos' | 'licuados' | 'yogurt' | 'snacks' | 'smoothies'`

---

## WhatsApp

El helper vive en **`lib/whatsapp.ts`**:

```ts
buildWhatsAppUrl(message?)     // mensaje genérico de contacto
buildOrderUrl(productName)     // "me gustaría ordenar: X"
buildDirectionsUrl(address)    // link a Google Maps
```

El número de WhatsApp se toma automáticamente de `BUSINESS_INFO.whatsapp`.

**Botón flotante:** se renderiza en `app/page.tsx` como `<WhatsAppFloatingButton />` — aparece en todas las secciones.

---

## SEO

### Metadata (`app/layout.tsx`)
- Title template: `%s | BarraFresh`
- Open Graph completo (imagen: `/public/og-image.jpg` — pendiente crear)
- Twitter Cards
- Keywords locales: ensaladas saludables Cuernavaca, jugos naturales, smoothies, etc.

### JSON-LD Schema.org
Tipo `FoodEstablishment` inyectado en `<head>` vía `dangerouslySetInnerHTML`. Incluye:
- Dirección, teléfono, email
- Horarios de apertura
- `aggregateRating` (4.9 / 200 reseñas — actualizar con datos reales)
- `sameAs` con redes sociales

### Variable de entorno
```env
# .env.local
NEXT_PUBLIC_BASE_URL=https://barrafresh.mx
```

### Sitemap y Robots
Generados automáticamente por Next.js en `/sitemap.xml` y `/robots.txt`.

---

## Componentes clave — notas de uso

### `Header.tsx`
- `'use client'` — necesario por el scroll listener y estado del menú móvil
- Cambia de `bg-white/80` a `bg-white/95 shadow-md` al hacer scroll
- Menú móvil: animación CSS pura con `max-h` + `opacity`

### `MenuSection.tsx`
- `'use client'` — filtro de categorías usa `useState`
- Lee directamente de `PRODUCTS` importado de `lib/data.ts`
- El botón de ordenar llama a `buildOrderUrl(product.name)` → WhatsApp con el nombre del producto

### `LocationSection.tsx`
- El mapa es un **placeholder** visual
- Para integrar Google Maps real, reemplazar el `div` con clase `bg-gray-100` por:
```tsx
<iframe
  src="https://www.google.com/maps/embed?pb=..."
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Ubicación BarraFresh"
/>
```

---

## Imágenes

Actualmente todas vienen de **Unsplash** (configurado en `next.config.ts`). Para producción:
1. Descargar imágenes propias o con licencia comercial
2. Colocarlas en `public/images/`
3. Cambiar las URLs en `lib/data.ts` y en los componentes de sección

**Pendiente crear:**
- `public/og-image.jpg` (1200×630px) — Open Graph
- `public/favicon.ico`
- `public/apple-touch-icon.png`

---

## Roadmap — arquitectura preparada para crecer

| Feature futura | Dónde agregar |
|---|---|
| Panel administrativo | `app/admin/` (route group con auth) |
| API de productos | `app/api/products/route.ts` |
| Base de datos | Reemplazar `lib/data.ts` con Prisma / Supabase |
| Pedidos por WhatsApp | Mejorar `lib/whatsapp.ts` + nueva sección |
| POS | `app/pos/` — nueva sección de la app |
| Inventario | `app/admin/inventario/` |
| Programa de lealtad | `app/loyalty/` + tabla de usuarios |
| Auth | Next-Auth o Clerk en `app/api/auth/` |

---

## Checklist antes de lanzar

- [ ] Actualizar `BUSINESS_INFO` en `lib/data.ts` con datos reales
- [ ] Crear/agregar `.env.local` con `NEXT_PUBLIC_BASE_URL`
- [ ] Agregar `public/og-image.jpg`, `public/favicon.ico`, `public/apple-touch-icon.png`
- [ ] Integrar iframe real de Google Maps en `LocationSection.tsx`
- [ ] Cambiar imágenes de Unsplash por fotos propias
- [ ] Actualizar coordenadas GPS en JSON-LD (`app/layout.tsx`)
- [ ] Actualizar `aggregateRating` con datos reales cuando haya reseñas
- [ ] Registrar negocio en Google Business Profile para SEO local
- [ ] Configurar dominio y deploy (Vercel recomendado para Next.js)
