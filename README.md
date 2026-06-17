# BarraFresh Web

Landing page y menú digital para **BarraFresh** — negocio de comida saludable (ensaladas, jugos naturales, licuados, smoothies, yogurt y snacks).

## Stack

- [Next.js 15](https://nextjs.org) — App Router
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_BASE_URL=https://barrafresh.mx
```

## Comandos

```bash
npm run dev      # Servidor de desarrollo → http://localhost:3000
npm run build    # Build de producción
npm run start    # Servidor de producción (requiere build previo)
```

## Estructura

```
app/                  # Rutas y layout (Next.js App Router)
components/
  layout/             # Header, Footer
  sections/           # Secciones de la landing page
  ui/                 # Componentes reutilizables
lib/
  data.ts             # Datos del negocio y productos (fuente única)
  whatsapp.ts         # Helpers para links de WhatsApp
  utils.ts            # Utilidades generales
types/
  index.ts            # Interfaces TypeScript
```

## Personalización

Todos los datos del negocio (nombre, teléfono, WhatsApp, horarios, productos, etc.) están centralizados en **`lib/data.ts`**. Es el único archivo que hay que modificar para actualizar contenido.

## Deploy

El proyecto está optimizado para desplegarse en [Vercel](https://vercel.com). Conecta el repositorio y configura la variable de entorno `NEXT_PUBLIC_BASE_URL`.

## Licencia

Copyright © 2025 BarraFresh. Todos los derechos reservados.
