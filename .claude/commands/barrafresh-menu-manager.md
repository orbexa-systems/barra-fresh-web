---
name: barrafresh-menu-manager
description: Conocimiento completo del esquema de menú de BarraFresh en Supabase. Úsalo siempre que vayas a crear, editar, eliminar o consultar productos, categorías, tamaños de ensalada, toppings o aderezos en el proyecto BarraFresh. También cuando generes migraciones SQL, Server Actions, funciones en lib/data/, o cualquier componente que interactúe con las tablas del menú. Si el usuario menciona productos, categorías, configurador, toppings, aderezos o tamaños en el contexto de BarraFresh, usa este skill antes de escribir cualquier código.
---

# BarraFresh — Menu Manager Skill

Este skill documenta el esquema completo del menú de BarraFresh en Supabase, las convenciones de la capa de datos y los patrones de código para manipular el menú correctamente.

---

## Tablas del menú

### `categorias`
Agrupa los productos del menú por tipo.

```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
nombre      VARCHAR NOT NULL        -- ej: Ensaladas, Jugos, Licuados, Snacks
orden       INTEGER DEFAULT 0       -- controla el orden de aparición en el menú
activo      BOOLEAN DEFAULT true    -- false = no aparece en el sitio ni en el POS
created_at  TIMESTAMP DEFAULT now()
```

**Reglas:**
- Solo se muestran categorías con `activo = true`
- El campo `orden` define el orden en pills de filtro y en el menú
- No eliminar categorías con productos asociados — desactivarlas con `activo = false`

---

### `productos`
Cada ítem del menú que el cliente puede ordenar.

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
categoria_id    UUID REFERENCES categorias(id)
nombre          VARCHAR NOT NULL
descripcion     TEXT
precio          DECIMAL(10,2) NOT NULL
imagen_url      TEXT                    -- URL de Supabase Storage bucket 'productos'
disponible      BOOLEAN DEFAULT true    -- toggle rápido de disponibilidad diaria
destacado       BOOLEAN DEFAULT false   -- aparece en sección "Menú destacado" del landing
orden           INTEGER DEFAULT 0       -- orden dentro de su categoría
created_at      TIMESTAMP DEFAULT now()
```

**Reglas:**
- `disponible = false` → el producto se ve con opacidad en el POS y no se puede agregar al carrito
- `destacado = true` → aparece en la landing page (máximo recomendado: 6 productos destacados)
- Las imágenes van en Supabase Storage bucket `productos` — la URL pública se guarda en `imagen_url`
- Nunca eliminar productos con historial de pedidos — desactivar con `disponible = false`

---

### `tamanos_ensalada`
Tamaños disponibles para el configurador de ensaladas.

```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
nombre      VARCHAR NOT NULL    -- Chica, Mediana, Grande
precio      DECIMAL(10,2) NOT NULL
activo      BOOLEAN DEFAULT true
orden       INTEGER DEFAULT 0   -- orden de aparición en el configurador
```

**Reglas:**
- Precio base de la ensalada = precio del tamaño seleccionado
- Solo mostrar tamaños con `activo = true`

---

### `toppings`
Ingredientes del configurador de ensaladas.

```sql
id           UUID PRIMARY KEY DEFAULT gen_random_uuid()
nombre       VARCHAR NOT NULL
tipo         VARCHAR NOT NULL CHECK (tipo IN ('base', 'especial'))
precio_extra DECIMAL(10,2) DEFAULT 0   -- toppings base suelen ser 0, especiales tienen extra
disponible   BOOLEAN DEFAULT true
orden        INTEGER DEFAULT 0
```

**Reglas:**
- `tipo = 'base'` → ingredientes estándar sin costo extra (ej: lechuga, zanahorra, pepino)
- `tipo = 'especial'` → ingredientes premium con precio extra (ej: pollo, aguacate, nueces)
- El precio total de la ensalada = precio del tamaño + suma de `precio_extra` de toppings especiales seleccionados
- Solo mostrar toppings con `disponible = true`

---

### `aderezos`
Aderezos disponibles para las ensaladas.

```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
nombre      VARCHAR NOT NULL    -- ej: Ranch, Vinagreta, Limón
disponible  BOOLEAN DEFAULT true
orden       INTEGER DEFAULT 0
```

**Reglas:**
- El cliente elige exactamente 1 aderezo
- Solo mostrar aderezos con `disponible = true`
- Sin costo extra — el aderezo está incluido en el precio de la ensalada

---

## Capa de datos — `lib/data/`

### `lib/data/categorias.ts`

```typescript
// Obtener todas las categorías activas ordenadas
export async function getCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('activo', true)
    .order('orden')
  if (error) throw error
  return data
}

// Obtener categoría por ID
export async function getCategoriaById(id: string) {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}
```

### `lib/data/productos.ts`

```typescript
// Todos los productos disponibles con su categoría
export async function getProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*, categorias(nombre)')
    .eq('disponible', true)
    .order('orden')
  if (error) throw error
  return data
}

// Productos por categoría
export async function getProductosByCategoria(categoriaId: string) {
  const { data, error } = await supabase
    .from('productos')
    .select('*, categorias(nombre)')
    .eq('categoria_id', categoriaId)
    .eq('disponible', true)
    .order('orden')
  if (error) throw error
  return data
}

// Solo productos destacados (para el landing)
export async function getProductosDestacados() {
  const { data, error } = await supabase
    .from('productos')
    .select('*, categorias(nombre)')
    .eq('disponible', true)
    .eq('destacado', true)
    .order('orden')
    .limit(6)
  if (error) throw error
  return data
}

// Todos los productos para el admin (incluyendo no disponibles)
export async function getProductosAdmin() {
  const { data, error } = await supabase
    .from('productos')
    .select('*, categorias(nombre)')
    .order('categoria_id')
    .order('orden')
  if (error) throw error
  return data
}
```

### `lib/data/configurador.ts`

```typescript
// Cargar todos los datos del configurador en paralelo
export async function getConfiguradorData() {
  const [tamanos, toppings, aderezos] = await Promise.all([
    supabase.from('tamanos_ensalada').select('*').eq('activo', true).order('orden'),
    supabase.from('toppings').select('*').eq('disponible', true).order('tipo').order('orden'),
    supabase.from('aderezos').select('*').eq('disponible', true).order('orden'),
  ])
  if (tamanos.error) throw tamanos.error
  if (toppings.error) throw toppings.error
  if (aderezos.error) throw aderezos.error
  return {
    tamanos: tamanos.data,
    toppingBase: toppings.data.filter(t => t.tipo === 'base'),
    toppingEspecial: toppings.data.filter(t => t.tipo === 'especial'),
    aderezos: aderezos.data,
  }
}
```

---

## Tipos TypeScript

```typescript
// types/menu.ts

export interface Categoria {
  id: string
  nombre: string
  orden: number
  activo: boolean
  created_at: string
}

export interface Producto {
  id: string
  categoria_id: string
  nombre: string
  descripcion: string | null
  precio: number
  imagen_url: string | null
  disponible: boolean
  destacado: boolean
  orden: number
  created_at: string
  categorias?: { nombre: string }
}

export interface TamanoEnsalada {
  id: string
  nombre: string
  precio: number
  activo: boolean
  orden: number
}

export interface Topping {
  id: string
  nombre: string
  tipo: 'base' | 'especial'
  precio_extra: number
  disponible: boolean
  orden: number
}

export interface Aderezo {
  id: string
  nombre: string
  disponible: boolean
  orden: number
}
```

---

## Cálculo de precio de ensalada

```typescript
// Siempre calcular así — nunca hardcodear precios
function calcularPrecioEnsalada(
  tamano: TamanoEnsalada,
  toppingsEspeciales: Topping[]
): number {
  const extraToppings = toppingsEspeciales.reduce(
    (sum, t) => sum + t.precio_extra, 0
  )
  return tamano.precio + extraToppings
}
```

---

## Políticas RLS relevantes

```sql
-- Lectura pública (sin autenticación)
CREATE POLICY "categorias_public_read" ON categorias
  FOR SELECT USING (activo = true);

CREATE POLICY "productos_public_read" ON productos
  FOR SELECT USING (disponible = true);

CREATE POLICY "tamanos_public_read" ON tamanos_ensalada
  FOR SELECT USING (activo = true);

CREATE POLICY "toppings_public_read" ON toppings
  FOR SELECT USING (disponible = true);

CREATE POLICY "aderezos_public_read" ON aderezos
  FOR SELECT USING (disponible = true);

-- Escritura solo para usuarios autenticados
CREATE POLICY "menu_authenticated_write" ON productos
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## Convenciones importantes

- Nunca hardcodear nombres de tablas como strings en componentes — siempre usar funciones de `lib/data/`
- Para el admin, usar `getProductosAdmin()` (incluye no disponibles) — nunca `getProductos()` (filtra por disponible)
- Las imágenes se suben a Supabase Storage bucket `productos` y la URL pública se guarda en `imagen_url`
- Al crear un producto nuevo, `orden` debe ser el mayor orden existente en esa categoría + 1
- El campo `precio` siempre en MXN, con 2 decimales, nunca formatear antes de guardar en BD
