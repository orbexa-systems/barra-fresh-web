---
name: barrafresh-design-system
description: Sistema de diseño completo de BarraFresh — tokens de marca, componentes, patrones de UI y convenciones visuales del admin y POS. Úsalo siempre que vayas a crear o modificar cualquier componente visual en el proyecto BarraFresh, incluyendo el sitio público, el panel admin (/admin) y el punto de venta (/pos). Si el usuario menciona diseño, UI, componentes, estilos, colores, layout, cards, tablas, modales, formularios o cualquier elemento visual de BarraFresh, consulta este skill antes de escribir cualquier JSX o clase de Tailwind. Garantiza consistencia visual en todo el proyecto.
---

# BarraFresh — Design System Skill

Este skill documenta el sistema de diseño completo de BarraFresh. Todo componente visual del proyecto debe seguir estas especificaciones.

---

## Tokens de marca (globals.css)

Los tokens están definidos como variables CSS en `globals.css`. Nunca usar valores hexadecimales directos en componentes — siempre usar los tokens.

```css
:root {
  --brand-primary: #16a34a;      /* Verde principal — botones, acciones, activos */
  --brand-accent: #15803d;       /* Verde oscuro — hover states, énfasis */
  --brand-light: #dcfce7;        /* Verde muy claro — fondos activos, badges */
}
```

En Tailwind, los tokens se usan como clases personalizadas definidas en `tailwind.config.js`:
```js
colors: {
  'brand-primary': 'var(--brand-primary)',
  'brand-accent': 'var(--brand-accent)',
  'brand-light': 'var(--brand-light)',
}
```

---

## Paleta de colores del sistema

### Texto
| Uso | Color | Clase Tailwind |
|-----|-------|----------------|
| Texto principal | #111827 | `text-gray-900` |
| Texto secundario | #6B7280 | `text-gray-500` |
| Texto deshabilitado | #9CA3AF | `text-gray-400` |
| Texto en botón primario | #FFFFFF | `text-white` |

### Fondos
| Uso | Color | Clase Tailwind |
|-----|-------|----------------|
| Fondo de página | #F9FAFB | `bg-gray-50` |
| Fondo de cards/paneles | #FFFFFF | `bg-white` |
| Fondo hover de filas | #FAFAFA | `hover:bg-gray-50` |
| Fondo activo (pills) | brand-primary 10% | `bg-brand-light` |

### Bordes
| Uso | Color | Clase Tailwind |
|-----|-------|----------------|
| Borde estándar | #E5E7EB | `border-gray-200` |
| Borde de inputs | #D1D5DB | `border-gray-300` |
| Borde activo | brand-primary | `border-brand-primary` |

### Estados de color
| Estado | Color | Clase Tailwind |
|--------|-------|----------------|
| Éxito / activo | #16a34a | `text-green-600` / `bg-green-50` |
| Error / eliminar | #EF4444 | `text-red-500` / `bg-red-50` |
| Advertencia | #F59E0B | `text-amber-500` / `bg-amber-50` |
| Info | #3B82F6 | `text-blue-500` / `bg-blue-50` |

---

## Tipografía

### Jerarquía de texto
| Elemento | Tamaño | Peso | Clase Tailwind |
|----------|--------|------|----------------|
| Título de sección (h1 admin) | 28px | Bold | `text-2xl font-bold text-gray-900` |
| Subtítulo de conteo | 14px | Normal | `text-sm text-gray-500` |
| Nombre de producto/ítem | 15px | Semibold | `text-[15px] font-semibold text-gray-900` |
| Descripción de producto | 13px | Normal | `text-[13px] text-gray-500` |
| Label de formulario | 14px | Medium | `text-sm font-medium text-gray-700` |
| Precio | 16px | Bold | `text-base font-bold text-gray-900` |
| Badge de categoría | 12px | Medium | `text-xs font-medium` |
| Texto de botón primario | 14px | Semibold | `text-sm font-semibold` |

### Fuente
- Sistema por defecto de Tailwind (`font-sans`) — no se usa fuente custom

---

## Espaciado y layout

### Márgenes y padding
- Padding de página: `p-6` (24px) mínimo
- Padding entre secciones principales: `gap-6` o `space-y-6`
- Padding interno de cards: `p-4` o `p-5`
- Padding de filas en listas: `px-5 py-4`
- Padding de botón primario: `px-5 py-3`

### Border radius
- Cards y contenedores: `rounded-xl` (12px)
- Botones: `rounded-lg` (8px)
- Inputs: `rounded-lg` (8px)
- Badges/pills: `rounded-full`
- Imágenes de producto: `rounded-lg` (8px)

### Sombras
- Cards y paneles: `shadow-sm`
- Modales y drawers: `shadow-xl`
- Dropdowns: `shadow-lg`

---

## Componentes del sistema

### Sidebar del admin (`components/admin/Sidebar.tsx`)

```tsx
// Especificaciones
width: 240px fijo
fondo: bg-white border-r border-gray-200

// Ítem de navegación — estado normal
<div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer">

// Ítem de navegación — estado activo
<div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-brand-primary bg-brand-light rounded-lg border-l-[3px] border-brand-primary">

// Logo en la parte superior
padding-top: 32px, padding-x: 16px

// Usuario y logout en la parte inferior
separado del menú con mt-auto
```

### Header de sección (`components/admin/SectionHeader.tsx`)

```tsx
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>
    <p className="text-sm text-gray-500 mt-1">{subtitulo}</p>
  </div>
  <button className="flex items-center gap-2 px-5 py-3 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-accent transition-colors">
    {accion}
  </button>
</div>
```

### Pills de filtro por categoría (`components/shared/CategoryFilter.tsx`)

```tsx
// Pill no seleccionado
<button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-colors">

// Pill seleccionado
<button className="px-4 py-2 text-sm font-medium text-brand-primary bg-brand-light border border-brand-primary rounded-full">
```

### Card de producto en tabla admin (`components/admin/ProductRow.tsx`)

```tsx
// Estructura de cada fila
<div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors min-h-[80px]">
  {/* Imagen 56x56 con placeholder */}
  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
    {imagen ? <Image .../> : <span className="text-brand-primary font-bold">{inicial}</span>}
  </div>

  {/* Info: nombre + badge + descripción */}
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2">
      <span className="text-[15px] font-semibold text-gray-900">{nombre}</span>
      <CategoryBadge categoria={categoria} />
    </div>
    <p className="text-[13px] text-gray-500 truncate mt-0.5">{descripcion}</p>
  </div>

  {/* Precio */}
  <span className="text-base font-bold text-gray-900 w-20 text-right">${precio}</span>

  {/* Toggles: Disponible y Destacado */}
  <div className="flex flex-col gap-2 w-28">
    <ToggleField label="Disponible" ... />
    <ToggleField label="Destacado" ... />
  </div>

  {/* Acciones */}
  <div className="flex items-center gap-1">
    <ActionButton icon="edit" tooltip="Editar producto" hoverColor="brand-primary" />
    <ActionButton icon="trash" tooltip="Eliminar producto" hoverColor="red-500" />
  </div>
</div>
```

### Badge de categoría (`components/shared/CategoryBadge.tsx`)

Cada categoría tiene un color asignado consistentemente:
```tsx
const categoryColors: Record<string, string> = {
  'Ensaladas':       'bg-green-100 text-green-700',
  'Jugos':           'bg-orange-100 text-orange-700',
  'Licuados':        'bg-purple-100 text-purple-700',
  'Yogurt Preparado':'bg-yellow-100 text-yellow-700',
  'Smoothies':       'bg-pink-100 text-pink-700',
  'Snacks':          'bg-blue-100 text-blue-700',
}

// Estructura
<span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColors[nombre] ?? 'bg-gray-100 text-gray-600'}`}>
  {nombre}
</span>
```

### Toggle con loading state (`components/shared/Toggle.tsx`)

```tsx
// Estado normal
<button className="relative w-11 h-6 rounded-full transition-colors bg-brand-primary">

// Estado loading (mientras se guarda)
<button className="relative w-11 h-6 rounded-full bg-gray-200 cursor-not-allowed">
  <Spinner size="xs" /> {/* spinner pequeño encima del toggle */}
</button>

// Label
<span className="text-[13px] text-gray-500 ml-2">{label}</span>
```

### Toast notification (`components/shared/Toast.tsx`)

```tsx
// Posición: fixed top-4 right-4 z-50
// Duración: 3000ms, con botón X para cerrar manualmente

// Variantes
success: 'bg-green-50 border border-green-200 text-green-800'
error:   'bg-red-50 border border-red-200 text-red-800'
warning: 'bg-amber-50 border border-amber-200 text-amber-800'

// Estructura
<div className="flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-sm">
  <Icon /> {/* check, x-circle, alert-triangle según variante */}
  <p className="text-sm font-medium">{mensaje}</p>
  <button onClick={close}>×</button>
</div>
```

### Drawer lateral (formulario de producto) (`components/admin/ProductDrawer.tsx`)

```tsx
// Overlay
<div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

// Drawer
<div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-xl z-50 flex flex-col">
  {/* Header */}
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
    <h2 className="text-lg font-semibold text-gray-900">{titulo}</h2>
    <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
  </div>

  {/* Contenido scrolleable */}
  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
    {/* secciones del formulario */}
  </div>

  {/* Footer fijo */}
  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
    {esEdicion && (
      <button className="text-sm text-red-500 hover:text-red-600">Eliminar producto</button>
    )}
    <div className="flex gap-3 ml-auto">
      <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
        Cancelar
      </button>
      <button className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-accent">
        Guardar producto
      </button>
    </div>
  </div>
</div>
```

### Skeleton loader (`components/shared/Skeleton.tsx`)

```tsx
// Clase base para cualquier skeleton
<div className="animate-pulse bg-gray-200 rounded" style={{ width, height }} />

// Skeleton de fila de producto
<div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
  <div className="w-14 h-14 rounded-lg bg-gray-200 animate-pulse" />
  <div className="flex-1 space-y-2">
    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
    <div className="h-3 w-64 bg-gray-200 rounded animate-pulse" />
  </div>
  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
</div>
```

### Estado vacío (`components/shared/EmptyState.tsx`)

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
    <Icon className="w-6 h-6 text-gray-400" />
  </div>
  <h3 className="text-sm font-semibold text-gray-900 mb-1">{titulo}</h3>
  <p className="text-sm text-gray-500 mb-4">{descripcion}</p>
  {accion && (
    <button className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-accent">
      {accion}
    </button>
  )}
</div>
```

---

## Layout del admin

```tsx
// app/admin/layout.tsx
<div className="flex h-screen bg-gray-50">
  <Sidebar />  {/* 240px fijo */}
  <main className="flex-1 overflow-y-auto">
    <div className="p-6">
      {children}
    </div>
  </main>
</div>
```

## Layout del POS

```tsx
// app/pos/layout.tsx — sin sidebar, pantalla completa
<div className="flex flex-col h-screen bg-gray-50">
  <POSHeader />
  <div className="flex flex-1 overflow-hidden gap-4 p-4">
    <Catalogo />        {/* 60% del ancho */}
    <ResumenPedido />   {/* 40% del ancho */}
  </div>
</div>
```

---

## Reglas de consistencia

1. **Nunca hardcodear colores hex** — siempre tokens de globals.css o clases de Tailwind de la paleta definida
2. **Nunca usar spinners genéricos** — siempre skeleton loaders con la forma del contenido
3. **Nunca truncar sin `truncate` de Tailwind** — usar `truncate` en descripciones largas
4. **Siempre incluir estados hover y focus** en elementos interactivos
5. **Reutilizar componentes de `components/shared/`** antes de crear uno nuevo
6. **El POS y el admin deben verse como el mismo sistema** — si algo se ve distinto entre ellos, revisar si falta aplicar una clase del design system
