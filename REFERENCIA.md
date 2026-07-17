# BarraFresh — Referencia del Proyecto

Estado: **Producción activa** | Última fase: Fase 4 (Producción y Pulido Final) — 2026-07-17

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 (tokens en `app/globals.css`) |
| Base de datos | Supabase — PostgreSQL + Auth + Storage |
| Auth client | `@supabase/ssr` 0.12.1 (cookies, SSR-safe) |
| Deploy | Vercel (CI/CD automático desde GitHub) |
| Imágenes | next/image + Supabase Storage |

---

## Ambientes

| Rama | URL | Propósito |
|------|-----|-----------|
| `master` | https://barra-fresh-web.vercel.app | Producción |
| `develop` | Preview automático de Vercel | Staging |

Dominio personalizado pendiente: `barrafresh.mx` → ver `DEPLOYMENT.md`.

---

## Ejecutar en local

```bash
npm install
cp .env.example .env.local   # copiar y rellenar variables
npm run dev                  # http://localhost:3000
npm run build                # build de producción
npm run typecheck            # TypeScript sin build
```

### Variables de entorno requeridas (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # solo servidor
NEXT_PUBLIC_BASE_URL=http://localhost:3000     # en local
```

Ver `DEPLOYMENT.md` para configuración completa en Vercel.

---

## Estructura de carpetas

```
barra-fresh-web/
├── app/
│   ├── layout.tsx              # Root layout: metadata SEO, JSON-LD, ToastProvider
│   ├── page.tsx                # Landing page (force-dynamic, Suspense en MenuSection)
│   ├── error.tsx               # Error boundary público
│   ├── not-found.tsx           # 404 personalizado
│   ├── globals.css             # Tailwind v4, tokens de color brand-*
│   ├── sitemap.ts              # Sitemap automático
│   ├── robots.ts               # robots.txt
│   ├── menu/
│   │   ├── page.tsx            # Menú digital (force-dynamic, URL del QR físico)
│   │   └── loading.tsx         # Skeleton de carga
│   ├── admin/
│   │   ├── (auth)/login/       # Pantalla de login
│   │   └── (panel)/
│   │       ├── layout.tsx      # Layout admin: sidebar + auth guard
│   │       ├── error.tsx       # Error boundary admin
│   │       ├── loading.tsx     # Skeleton de carga admin
│   │       ├── page.tsx        # Dashboard KPIs
│   │       ├── menu/           # CRUD productos y categorías
│   │       ├── pedidos/        # Gestión de pedidos + PedidoDrawer
│   │       ├── configurador/   # Tamaños, toppings, aderezos
│   │       └── reportes/       # Estadísticas (placeholder)
│   ├── pos/
│   │   ├── layout.tsx          # Layout POS + auth guard
│   │   ├── error.tsx           # Error boundary POS
│   │   ├── page.tsx            # POS principal (server, carga datos)
│   │   ├── POSClient.tsx       # POS client: carrito, toast, mobile responsive
│   │   ├── actions.ts          # Server Action: crearPedidoPOS
│   │   └── ticket/[id]/        # Ticket imprimible
│   └── actions/
│       └── pedidos.ts          # Server Action: crearPedidoWhatsapp
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Header sticky, scroll-aware, móvil
│   │   └── Footer.tsx          # Logo, nav, horarios, contacto, redes
│   ├── menu/
│   │   └── MenuClient.tsx      # Filtros + grid ('use client')
│   ├── sections/               # Secciones de la landing page
│   │   ├── HeroSection.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── MenuSection.tsx     # Async server component (usa unstable_cache)
│   │   ├── GallerySection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── OrderSection.tsx
│   │   └── LocationSection.tsx
│   ├── admin/
│   │   ├── AdminSidebar.tsx    # Sidebar del panel admin
│   │   ├── ProductForm.tsx     # Formulario crear/editar producto (useActionState)
│   │   ├── ProductList.tsx     # Lista de productos con toggles
│   │   ├── ProductTable.tsx    # Tabla con DeleteButton
│   │   └── ToggleSwitch.tsx    # Toggle con spinner al guardar
│   ├── pos/
│   │   ├── Catalogo.tsx        # Catálogo del POS con buscador
│   │   ├── ResumenPedido.tsx   # Carrito + confirmación (timeout 10s)
│   │   ├── ItemPedido.tsx      # Ítem individual del carrito
│   │   └── PedidoConfirmado.tsx
│   ├── shared/
│   │   └── Toast.tsx           # Sistema de toast (ToastProvider + useToast)
│   └── ui/
│       ├── Button.tsx
│       ├── WhatsAppButton.tsx
│       └── StarRating.tsx
│
├── lib/
│   ├── supabase.ts             # createBrowserSupabaseClient, createServiceClient, createPublicClient
│   ├── supabase-server.ts      # createServerSupabaseClient (cookies SSR)
│   ├── data.ts                 # BUSINESS_INFO y datos estáticos del negocio
│   ├── whatsapp.ts             # buildWhatsAppUrl, buildOrderUrl
│   ├── utils.ts                # formatPrice, cn
│   └── data/
│       ├── categorias.ts       # getCategorias (unstable_cache 1h)
│       ├── productos.ts        # getProductos, getProductosDestacados, getProductosByCategoria (unstable_cache 5min)
│       ├── configurador.ts     # getTamanos, getToppings, getAderezos (unstable_cache 1h)
│       └── pedidos.ts          # getPedidos (sin cache, datos en tiempo real)
│
├── types/
│   ├── database.ts             # Tipos generados de Supabase (tablas, enums)
│   └── index.ts                # Interfaces generales
│
├── supabase/
│   ├── schema.sql              # SQL completo: tablas + RLS + seed
│   └── fix_rls_fase4.sql       # Parches RLS aplicados en Fase 4 ✓
│
├── proxy.ts                    # Protege /admin/* y /pos/* (Next.js 16: proxy, no middleware)
├── next.config.ts              # remotePatterns, security headers, redirect www
├── DEPLOYMENT.md               # Guía completa de despliegue en Vercel
└── MANUAL_CLIENTE.md           # Manual de uso para el equipo BarraFresh
```

---

## Rutas del sitio

### Públicas (sin login)
| Ruta | Descripción |
|------|-------------|
| `/` | Landing page completa |
| `/menu` | Menú digital — URL para el QR físico |

### Admin (requieren sesión)
| Ruta | Descripción |
|------|-------------|
| `/admin/login` | Login con Supabase Auth |
| `/admin` | Dashboard con KPIs del día |
| `/admin/menu` | CRUD de productos y categorías |
| `/admin/menu/nuevo` | Formulario nuevo producto |
| `/admin/menu/[id]/editar` | Formulario editar producto |
| `/admin/pedidos` | Lista de pedidos + drawer de detalle |
| `/admin/configurador` | Tamaños, toppings y aderezos para ensaladas |
| `/admin/reportes` | Estadísticas (placeholder) |
| `/pos` | Punto de venta (tablet/desktop) |
| `/pos/ticket/[id]` | Ticket imprimible de un pedido |

---

## Base de datos (Supabase)

### Tablas principales

| Tabla | Descripción |
|-------|-------------|
| `categorias` | Categorías del menú (nombre, activo, orden) |
| `productos` | Productos (nombre, precio, imagen_url, disponible, destacado, categoria_id) |
| `tamanos_ensalada` | Tamaños disponibles para ensaladas personalizadas |
| `toppings` | Ingredientes — base (gratis) o especial (precio_extra) |
| `aderezos` | Aderezos disponibles |
| `pedidos` | Todos los pedidos (origen: 'pos' o 'whatsapp', estado, items JSON, total) |

### RLS (Row Level Security)

- **Lectura pública** (anon key): solo registros activos/disponibles
- **Admin** (sesión autenticada): acceso completo a todas las filas
- **Server Actions** (`createServiceClient` con service_role): bypasea RLS para INSERTs de pedidos

### Almacenamiento (Storage)

- Bucket `productos` — imágenes de productos, acceso público

---

## Arquitectura — decisiones clave

### Clientes Supabase
```
createPublicClient()          → anon key, sin cookies, para unstable_cache
createBrowserSupabaseClient() → anon key + localStorage, para client components (auth)
createServerSupabaseClient()  → cookies via @supabase/ssr, para server components autenticados
createServiceClient()         → service_role, bypasea RLS, solo en server actions
```

### Caché de datos públicos
- Usa `unstable_cache` de Next.js (no `use cache` que requiere `cacheComponents: true`)
- `createPublicClient()` para no llamar `cookies()` dentro del cache
- TTL: 5 min productos, 1h categorías/configurador
- Invalidación: `revalidatePath` en cada mutación del admin

### Renderizado
- `/` y `/menu`: `force-dynamic` — renderizan en cada request, datos vienen del cache de Supabase
- Admin y POS: `force-dynamic` automático (usan `cookies()` vía `createServerSupabaseClient`)

### Auth
- `proxy.ts` (Next.js 16 — no `middleware.ts`) protege `/admin/*` y `/pos/*`
- Doble verificación: proxy + `layout.tsx` de cada sección (defense in depth)

### Toasts
- `<ToastProvider>` en `app/layout.tsx` envuelve toda la app
- `useToast()` disponible en cualquier client component

---

## Datos del negocio — dónde cambiarlos

Centralizado en **`lib/data.ts`**:

```ts
export const BUSINESS_INFO = {
  name: 'BarraFresh',
  phone: '+525613013325',
  whatsapp: '525613013325',
  email: 'contacto@barrafresh.mx',      // ← actualizar al real
  address: 'Calle Lirio 20, Col. Lomas de San Miguel',
  city: 'Atizapán de Zaragoza, Estado de México, CP 52928',
  socialMedia: {
    instagram: 'https://instagram.com/barrafresh',   // ← actualizar
    facebook:  'https://facebook.com/barrafresh',    // ← actualizar
    tiktok:    'https://tiktok.com/@barrafresh',     // ← actualizar
  },
}
```

---

## Colores de marca — tokens

Todos los colores están en `app/globals.css` bajo `:root`. **Nunca usar clases Tailwind de color directo** (ej. `green-600`).

| Token | Uso |
|-------|-----|
| `brand-primary` | Color principal verde |
| `brand-primary-dark` | Verde oscuro (hover) |
| `brand-primary-light` | Verde claro (focus rings) |
| `brand-accent` | Acento amarillo/ámbar |
| `brand-accent-dark` | Acento oscuro |
| `brand-surface` | Fondo suave verde |
| `brand-surface-mid` | Fondo medio verde |

Para cambiar un color: editar el hex en `:root` de `globals.css`. Se propaga automáticamente.

---

## Checklist de producción

### ✅ Completado
- [x] Stack: Next.js 16 + Supabase + Vercel
- [x] Landing page completa (Hero, Menú, Galería, Testimonios, Ubicación, WhatsApp)
- [x] Menú digital en `/menu` con configurador de ensaladas
- [x] Panel admin: productos, categorías, pedidos, configurador
- [x] Punto de venta (POS) con carrito, ensaladas personalizadas y confirmación
- [x] Auth con Supabase (cookies SSR)
- [x] RLS activo en todas las tablas
- [x] Caché de datos públicos con `unstable_cache`
- [x] Error boundaries en 3 niveles (público, admin, POS)
- [x] Sistema de toasts en toda la app
- [x] POS responsive en mobile
- [x] Security headers HTTP
- [x] `DEPLOYMENT.md` con guía completa
- [x] `MANUAL_CLIENTE.md` para el equipo BarraFresh
- [x] CI/CD: typecheck + build en cada PR

### ⏳ Pendiente (próximas iteraciones)
- [ ] Dominio personalizado `barrafresh.mx` en Vercel (ver `DEPLOYMENT.md`)
- [ ] `public/favicon.ico` — ícono de la pestaña
- [ ] `public/apple-touch-icon.png` (180×180px) — guardar en iPhone
- [ ] `public/og-image.jpg` (1200×630px) — imagen al compartir en WhatsApp/redes
- [ ] Fotos reales del negocio (reemplazar Unsplash)
- [ ] Email real en `lib/data.ts` → `BUSINESS_INFO.email`
- [ ] Redes sociales reales en `BUSINESS_INFO.socialMedia`
- [ ] Coordenadas GPS reales en JSON-LD (`app/layout.tsx` → campo `geo`)
- [ ] `aggregateRating` real en JSON-LD (cuando haya reseñas verificadas)
- [ ] Google Business Profile
- [ ] Admin panel en mobile (deferred — baja prioridad, se usa en desktop/tablet)
- [ ] Filtros en admin/pedidos: por fecha, por estado (deferred)
- [ ] Filtro de disponibilidad en admin/menu (deferred)
- [ ] Sección `/admin/reportes` con estadísticas reales (deferred)
