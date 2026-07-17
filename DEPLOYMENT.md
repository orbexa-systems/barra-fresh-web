# Guía de despliegue — BarraFresh

## Arquitectura de ambientes

| Rama | Ambiente | URL |
|------|----------|-----|
| `develop` | Staging | https://barrafresh-stage.vercel.app |
| `master`  | Producción | https://barrafresh.mx (dominio personalizado) |

El flujo siempre es: **rama feature → develop (staging) → master (producción)**.

---

## 1. Variables de entorno en Vercel

Configura las siguientes variables en **Vercel Dashboard → Project → Settings → Environment Variables**.

### Variables para todos los ambientes (Production + Preview + Development)

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública anon (segura para el navegador) | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo servidor, bypasea RLS) | Supabase → Settings → API → service_role |

> **Importante:** `SUPABASE_SERVICE_ROLE_KEY` **nunca** debe tener el prefijo `NEXT_PUBLIC_`.
> Si se filtra al navegador, cualquier usuario puede leer/escribir toda la base de datos.

### Variable solo para Production

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_BASE_URL` | `https://barrafresh.mx` |

### Variable solo para Preview/Staging (rama `develop`)

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_BASE_URL` | `https://barrafresh-stage.vercel.app` |

---

## 2. Pasos para configurar las variables en Vercel

1. Ir a https://vercel.com → seleccionar el proyecto `barra-fresh-web`
2. **Settings → Environment Variables**
3. Para cada variable:
   - Escribir el nombre exacto (mayúsculas y guiones bajos)
   - Pegar el valor
   - Seleccionar los ambientes correspondientes (Production / Preview / Development)
   - Clic en **Save**
4. Después de añadir o cambiar variables: **redeploy** (Deployments → botón "Redeploy" en el último deployment)

---

## 3. Dominio personalizado (barrafresh.mx)

### En Vercel

1. **Settings → Domains → Add Domain**
2. Ingresar `barrafresh.mx`
3. Vercel mostrará los registros DNS a configurar

### En el proveedor de dominio (Namecheap, GoDaddy, etc.)

Añadir estos registros DNS:

```
Tipo    Nombre    Valor
A       @         76.76.21.21
CNAME   www       cname.vercel-dns.com
```

> Vercel ya maneja el redirect `www.barrafresh.mx → barrafresh.mx` de forma permanente (301),
> configurado también en `next.config.ts`.

### Verificar SSL

Vercel provisiona certificado Let's Encrypt automáticamente tras verificar el dominio.
El certificado queda activo en ~2 minutos después de que el DNS propague (puede tardar hasta 48h).

---

## 4. Configuración de Supabase para producción

### Auth → URL Configuration

En **Supabase Dashboard → Authentication → URL Configuration**:

- **Site URL**: `https://barrafresh.mx`
- **Redirect URLs** (añadir ambas):
  - `https://barrafresh.mx/**`
  - `https://barrafresh-stage.vercel.app/**`

### Row Level Security (RLS)

Ejecutar el script `supabase/fix_rls_fase4.sql` en **Supabase Dashboard → SQL Editor**
si aún no se ha aplicado. Este script:

- Restringe lectura pública a productos/toppings/aderezos activos (`disponible = true`, `activo = true`)
- Elimina la política que permitía insertar pedidos sin autenticación desde el navegador

### Storage

El bucket `productos` debe estar configurado como **público** para que las imágenes
se sirvan sin autenticación. Verificar en **Storage → productos → Policies**.

---

## 5. Headers de seguridad

Los siguientes headers se aplican automáticamente en todos los ambientes vía `next.config.ts`:

| Header | Valor | Protege contra |
|--------|-------|----------------|
| `X-Frame-Options` | `SAMEORIGIN` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Fuga de URLs en referrer |
| `X-DNS-Prefetch-Control` | `on` | — (performance) |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Acceso a hardware del dispositivo |

Vercel añade automáticamente `Strict-Transport-Security` (HSTS) en los dominios de producción.

---

## 6. Flujo de despliegue

### Publicar una nueva función en producción

```bash
# 1. Desarrollar en una rama feature
git checkout -b feat/nueva-funcion
# ... commits ...

# 2. PR a develop → merge → staging se actualiza automáticamente
gh pr create --base develop

# 3. Verificar en staging: https://barrafresh-stage.vercel.app

# 4. PR de develop a master
gh pr create --base master --head develop

# 5. Tras confirmar el PR → producción se actualiza automáticamente
```

### Rollback de emergencia

En Vercel Dashboard → Deployments → seleccionar un deployment anterior → **Promote to Production**.
El rollback es inmediato (sin redeploy).

---

## 7. Variables opcionales / futuras

| Variable | Uso |
|----------|-----|
| `RESEND_API_KEY` | Envío de emails transaccionales (si se integra Resend) |
| `WHATSAPP_PHONE` | Número de WhatsApp para el botón flotante (actualmente en código) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics (si se configura) |
