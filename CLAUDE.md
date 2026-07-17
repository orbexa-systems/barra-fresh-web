# CLAUDE.md — BarraFresh · Orbexa Systems

Este archivo va en la raíz del proyecto BarraFresh. Claude Code lo lee automáticamente al iniciar sesión.

---

## Idioma y estilo de comunicación

- Todos los prompts, comentarios de commits y explicaciones en **español**.
- El código (variables, funciones, clases, interfaces, tipos) en **inglés**, siguiendo convención estándar de la industria.
- Los comentarios dentro del código siempre en **inglés**, sin excepción.

---

## Modo de trabajo

- Actúa como implementador autónomo: una vez que la tarea esté clara, ejecuta de principio a fin sin pedir confirmación en cada paso.
- Minimiza los check-ins intermedios. Pregunta solo cuando:
  - La decisión afecta arquitectura o modelo de datos de forma difícil de revertir.
  - Hay ambigüedad real que no se puede resolver con un supuesto razonable.
  - Se requiere una credencial, API key, o acceso que no está disponible.
- Si tomas un supuesto para avanzar, decláralo brevemente y continúa — no te detengas a esperar aprobación por cosas menores.

---

## Control de versiones (obligatorio)

- Nunca subir cambios directamente a `master` o `develop`.
- Para cualquier cambio, por pequeño que sea, siempre crear un branch nuevo primero y trabajar ahí:
  - `feature/nombre-de-la-funcionalidad`
  - `fix/descripcion-del-bug`
  - `chore/tarea-de-mantenimiento`
- Los cambios llegan a `master`/`develop` únicamente vía merge/PR, nunca con push directo.
- `develop` → staging en Vercel (revisión previa a producción).
- `master` → producción en Vercel (solo cuando develop está validado).

### Workflow Git — seguir SIEMPRE

#### Antes de cualquier tarea de código
1. Verificar que `develop` y `master` están sincronizadas:
   ```
   git fetch origin
   git log origin/develop..origin/master
   ```
2. Actualizar `develop` local y crear rama de trabajo:
   ```
   git checkout develop && git pull origin develop
   git checkout -b <tipo>/<descripcion-corta>
   ```

#### Durante el desarrollo
- Commits atómicos con mensaje descriptivo en español (ver convenciones abajo)
- Nunca commitear directo a `develop` ni a `master`

#### Al terminar los cambios locales
3. Probar en local antes de cualquier push (`npm run dev`, `npm run typecheck`)
4. Push de la rama y crear PR apuntando a **`develop`**:
   ```
   git push -u origin <rama>
   gh pr create --base develop ...
   ```
5. **SIEMPRE preguntar al usuario antes de mergear el PR a `develop`.**

#### Después de confirmar merge a develop
6. Mergear a `develop` → Vercel despliega en staging automáticamente
7. **SIEMPRE preguntar al usuario antes de crear el PR de `develop` → `master`.**
8. **SIEMPRE preguntar al usuario antes de mergear ese PR a `master`.**

#### Reglas críticas de merge
- Al mergear feature/fix a `develop`: usar `--delete-branch`
- Al mergear `develop` a `master`: **NUNCA usar `--delete-branch`** — borraría `develop` del remoto

#### Ambientes
- `master` → producción (barra-fresh-web.vercel.app | dominio: barrafresh.mx)
- `develop` → staging (preview automático de Vercel)

---

## Documentación de decisiones

Mantén un archivo `DECISIONS.md` en la raíz del proyecto. Cada decisión relevante se agrega como entrada breve:

```
## [fecha] Título de la decisión
**Contexto:** por qué surgió la decisión
**Decisión:** qué se eligió
**Alternativas consideradas:** (si aplica)
```

No documentes cambios triviales — solo lo que un colaborador futuro (o tú en 3 meses) necesitaría para entender el "por qué".

---

## Verificación y pruebas

- Antes de dar por terminada una tarea, verifica tu propio trabajo (compilar, revisar que no rompiste nada existente) sin que se te tenga que recordar.
- El proyecto no tiene tests automatizados todavía — describe brevemente cómo probaste manualmente cada cambio al terminar.

---

## Stack del proyecto

### Frontend
- **Next.js 16** con App Router (leer `node_modules/next/dist/docs/` para APIs actuales — hay breaking changes)
- **Tailwind CSS v4** — estilos con tokens de marca centralizados en `globals.css`
- Tokens de marca: `brand-primary`, `brand-accent` y paleta de grises definida — nunca usar colores hardcodeados, siempre los tokens
- **TypeScript** en todos los archivos — sin excepción

### Base de datos y autenticación
- **Supabase** (PostgreSQL) como base de datos principal
- **Supabase Auth** + **`@supabase/ssr` 0.12.1** para autenticación del admin y POS
- **Supabase Storage** (bucket `productos`) para imágenes de productos
- RLS habilitado en todas las tablas — nunca deshabilitar RLS para "simplificar"

### Deploy
- **Vercel** — deploy automático desde GitHub
- `develop` → staging | `master` → producción

### Next.js 16 — notas críticas
- `middleware.ts` DEPRECADO — usar `proxy.ts` con función exportada `proxy`
- `proxy.ts` en la raíz protege `/admin/*` y `/pos/*`
- Usar `unstable_cache` (no `use cache` — requiere `cacheComponents: true`)
- `force-dynamic` en `/` y `/menu` para evitar prerender en CI sin env vars de Supabase

---

## Estructura de rutas

```
/                   → Landing page pública
/menu               → Catálogo completo de productos
/admin              → Panel de administración (protegido)
/admin/login        → Login del admin
/admin/menu         → Gestión de productos y categorías
/admin/configurador → Gestión de tamaños, toppings y aderezos
/admin/pedidos      → Historial y gestión de pedidos
/admin/reportes     → Ventas y estadísticas
/pos                → Punto de venta (protegido)
/pos/ticket/[id]    → Vista de ticket imprimible
```

---

## Estructura de base de datos

### Tablas principales
- `categorias` — categorías del menú (id, nombre, orden, activo)
- `productos` — productos del menú (id, categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
- `tamanos_ensalada` — tamaños del configurador (id, nombre, precio, activo, orden)
- `toppings` — ingredientes del configurador (id, nombre, tipo: 'base'|'especial', precio_extra, disponible, orden)
- `aderezos` — aderezos del configurador (id, nombre, disponible, orden)
- `pedidos` — todos los pedidos (id, origen: 'whatsapp'|'pos', nombre_cliente, estado, items JSONB, total, notas, created_at, updated_at)

### Estados de pedido
- `pendiente` — pedido de WhatsApp guardado, esperando confirmación del restaurante
- `confirmado` — pedido confirmado (todos los pedidos POS llegan directamente aquí)
- `entregado` — pedido entregado al cliente
- `cancelado` — pedido cancelado

### Políticas RLS
- Lectura pública sin autenticación: `categorias`, `productos` (solo disponible=true), `tamanos_ensalada` (activo=true), `toppings` (disponible=true), `aderezos` (disponible=true)
- INSERT público permitido solo en `pedidos` (para pedidos de WhatsApp desde el sitio público)
- Todo lo demás requiere usuario autenticado

---

## Clientes Supabase

```
createPublicClient()          → anon key, sin cookies — para unstable_cache
createBrowserSupabaseClient() → anon key + localStorage — client components (auth)
createServerSupabaseClient()  → cookies via @supabase/ssr — server components autenticados
createServiceClient()         → service_role, bypasea RLS — solo en server actions
```

`createServiceClient` y `SUPABASE_SERVICE_ROLE_KEY` solo en Server Components y Server Actions — nunca en Client Components.

---

## Capa de datos (`lib/data/`)

Todas las consultas a Supabase van en archivos dedicados bajo `lib/data/`:
- `categorias.ts` — `getCategorias` (unstable_cache 1h)
- `productos.ts` — `getProductos`, `getProductosDestacados`, `getProductosByCategoria` (unstable_cache 5min)
- `configurador.ts` — `getTamanos`, `getToppings`, `getAderezos` (unstable_cache 1h)
- `pedidos.ts` — `getPedidos` (sin cache, datos en tiempo real)

Nunca hacer llamadas directas a Supabase desde los componentes — siempre usar las funciones de `lib/data/`.

---

## Convenciones de componentes

- **Server Components** por defecto — usar `'use client'` solo cuando sea estrictamente necesario (interactividad, hooks de estado)
- **Server Actions** para todas las operaciones de escritura (crear, editar, eliminar)
- Componentes compartidos entre admin y POS van en `components/shared/`
- Componentes del admin en `components/admin/`
- Componentes del POS en `components/pos/`
- Componentes del sitio público en `components/`

---

## Sistema de diseño

El admin (`/admin`) y el POS (`/pos`) comparten el mismo sistema de diseño. Siempre mantener consistencia:
- Spacing mínimo entre secciones: 24px
- Border-radius de cards: 8px
- Texto principal: `#111827` | Texto secundario: `#6B7280` | Fondos: `#F9FAFB` | Bordes: `#E5E7EB`
- Pills/chips de filtro: seleccionado con `brand-primary` al 10% opacidad y borde `brand-primary`
- Botones primarios: `brand-primary`, border-radius 8px, padding 12px 20px
- Skeleton loaders para estados de carga — nunca spinners genéricos
- Toast notifications desde `components/shared/Toast.tsx` para confirmaciones y errores

---

## Convenciones de commits

Formato imperativo corto en español:

```
Agrega modal de nuevo producto al admin
Corrige cálculo de total en el POS
Conecta catálogo del /menu a Supabase
Migra imágenes de productos a next/image
```

Prefijos opcionales para claridad:
- `[fix]` para corrección de bugs
- `[chore]` para tareas de mantenimiento sin impacto en funcionalidad

No incluir co-autoría de Claude en commits ni PRs.

---

## Seguridad (obligatorio)

- Nunca subir `.env.local` ni ningún archivo con credenciales al repositorio
- Variables públicas (visibles en el navegador): solo `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` solo en Server Components y Server Actions — nunca en Client Components
- Verificar `.gitignore` al iniciar cualquier sesión de trabajo nueva

---

## .gitignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js build output
.next/
out/

# Environment variables — NUNCA subir al repo
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/

# Misc
*.pem
.cache/
```

---

## Contacto y soporte del proyecto

- **Desarrollador:** Daniel — Orbexa Systems
- **Correo:** contacto@orbexasystems.com.mx
- **Sitio:** orbexasystems.com.mx
