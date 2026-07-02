# BarraFresh — Plan de Backend

## Decisión tecnológica

**Supabase + Next.js Route Handlers**

Todo el backend vive dentro de este mismo proyecto. Los Route Handlers (`app/api/`) corren en el servidor y nunca exponen credenciales al cliente. Supabase provee la base de datos, autenticación y storage.

No se necesita un proyecto separado.

---

## Stack

| Capa | Tecnología |
|---|---|
| Base de datos | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage (imágenes) | Supabase Storage |
| API | Next.js Route Handlers (`app/api/`) |
| Validación | Zod |
| Cliente Supabase | `@supabase/ssr` + `@supabase/supabase-js` |

---

## Costo

| Plan | Precio | Límites |
|---|---|---|
| Free | $0/mes | 500 MB DB · 1 GB Storage · 500K requests/mes |
| Pro | $25 USD/mes | Sin pausas · más recursos |

**Catch del tier gratuito:** la base de datos se pausa si no hay actividad por 7 días.
**Solución:** un Route Handler de ping ejecutado como cron cada 3 días.

```ts
// app/api/ping/route.ts
export async function GET() {
  await supabase.from('products').select('id').limit(1)
  return Response.json({ ok: true })
}
```

---

## Estructura de carpetas a agregar

```
app/
├── api/
│   ├── products/
│   │   └── route.ts        ← GET (lista) · POST (crear)
│   ├── products/[id]/
│   │   └── route.ts        ← PUT (editar) · DELETE (eliminar)
│   ├── orders/
│   │   └── route.ts        ← POST (registrar pedido) · GET (listar)
│   ├── reviews/
│   │   └── route.ts        ← GET (listar) · POST (crear reseña)
│   └── ping/
│       └── route.ts        ← keepalive para tier gratuito
│
├── admin/
│   ├── layout.tsx          ← protección de ruta (verifica sesión)
│   ├── page.tsx            ← dashboard: resumen de pedidos
│   ├── menu/
│   │   └── page.tsx        ← CRUD de productos
│   └── pedidos/
│       └── page.tsx        ← lista de pedidos con estado
│
lib/
├── supabase/
│   ├── client.ts           ← cliente browser ('use client')
│   ├── server.ts           ← cliente servidor (Route Handlers, Server Components)
│   └── middleware.ts       ← refresco de sesión en cada request
```

---

## Tablas en Supabase

### `products`
Reemplaza `lib/data.ts`. El admin puede editar sin tocar código.

```sql
CREATE TABLE products (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL,
  image       TEXT,
  category    TEXT NOT NULL,
  featured    BOOLEAN DEFAULT false,
  available   BOOLEAN DEFAULT true,
  tags        TEXT[],
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### `orders`
Registro de pedidos que llegan por WhatsApp.

```sql
CREATE TABLE orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  customer     TEXT,
  status       TEXT DEFAULT 'recibido', -- recibido | preparando | listo | entregado
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

### `reviews`
Reemplaza el `aggregateRating` hardcodeado en `app/layout.tsx`.

```sql
CREATE TABLE reviews (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author     TEXT NOT NULL,
  rating     INT CHECK (rating BETWEEN 1 AND 5),
  body       TEXT,
  approved   BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Autenticación (panel admin)

Supabase Auth con email + contraseña. Solo el dueño del negocio necesita acceso.

```ts
// app/admin/layout.tsx
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <>{children}</>
}
```

---

## Migración de lib/data.ts

El cambio es no-destructivo: se puede hacer en paralelo.

1. Crear las tablas en Supabase
2. Insertar los productos actuales de `lib/data.ts` como seed
3. Cambiar los Server Components para leer de Supabase en vez del archivo
4. Eliminar `lib/data.ts` cuando todo esté validado

---

## Variables de entorno

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # solo en servidor, nunca en cliente
NEXT_PUBLIC_BASE_URL=https://barrafresh-web.vercel.app
```

En Vercel: agregar estas mismas variables en Settings → Environment Variables.

---

## Prioridad de implementación

| # | Feature | Impacto | Esfuerzo |
|---|---|---|---|
| 1 | Conectar Supabase + migrar productos | Alto | Bajo |
| 2 | Panel admin — disponibilidad de productos | Alto | Bajo |
| 3 | Registro de pedidos por WhatsApp | Alto | Medio |
| 4 | Auth panel admin | Alto | Bajo |
| 5 | Reseñas reales | Medio | Medio |
| 6 | Storage — fotos propias | Medio | Bajo |
| 7 | Realtime en pedidos | Medio | Bajo |
| 8 | Programa de lealtad | Bajo | Alto |
