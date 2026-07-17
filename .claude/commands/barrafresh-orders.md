---
name: barrafresh-orders
description: >
  Conocimiento completo del sistema de pedidos de BarraFresh — tabla de pedidos, estados,
  flujos de WhatsApp y POS, estructura del JSONB de items y funciones de la capa de datos.
  Úsalo siempre que trabajes con pedidos en el proyecto BarraFresh: crear pedidos desde el
  sitio público o el POS, cambiar estados en el admin, mostrar historial, generar reportes
  de ventas, o calcular totales. Si el usuario menciona pedidos, órdenes, carrito, ticket,
  historial, ventas o reportes en el contexto de BarraFresh, consulta este skill antes de
  escribir cualquier código relacionado.
---

# BarraFresh — Orders Skill

Este skill documenta el sistema completo de pedidos de BarraFresh: esquema de la tabla, estados, flujos, estructura de datos y patrones de código.

---

## Tabla `pedidos`

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
origen          VARCHAR NOT NULL CHECK (origen IN ('whatsapp', 'pos'))
nombre_cliente  VARCHAR             -- opcional, para llamar al cliente cuando esté listo
estado          VARCHAR NOT NULL DEFAULT 'pendiente'
                  CHECK (estado IN ('pendiente', 'confirmado', 'entregado', 'cancelado'))
items           JSONB NOT NULL      -- array de ítems del pedido (ver estructura abajo)
total           DECIMAL(10,2) NOT NULL
notas           TEXT                -- notas generales del pedido
created_at      TIMESTAMP DEFAULT now()
updated_at      TIMESTAMP DEFAULT now()
```

---

## Estados del pedido

| Estado | Origen | Descripción |
|--------|--------|-------------|
| `pendiente` | WhatsApp | El cliente generó el pedido en el sitio y abrió WhatsApp. Esperando que el restaurante lo confirme. |
| `confirmado` | WhatsApp / POS | WhatsApp: el empleado confirmó que llegó el pedido. POS: todos los pedidos del POS llegan directamente aquí. |
| `entregado` | Cualquiera | El pedido fue entregado al cliente. |
| `cancelado` | Cualquiera | El pedido fue cancelado. |

### Flujo de estados

```
WhatsApp: pendiente → confirmado → entregado
                   ↘ cancelado

POS:      confirmado → entregado
                    ↘ cancelado
```

**Regla importante:** Los pedidos del POS **nunca pasan por `pendiente`** — se crean directamente como `confirmado`.

---

## Estructura del JSONB `items`

El campo `items` es un array JSON con la siguiente estructura. Cada ítem puede ser un producto regular o una ensalada configurada.

### Producto regular

```json
{
  "tipo": "producto",
  "producto_id": "uuid-del-producto",
  "nombre": "Smoothie Açaí",
  "cantidad": 2,
  "precio_unitario": 110.00,
  "subtotal": 220.00,
  "notas": "Sin granola"
}
```

### Ensalada configurada

```json
{
  "tipo": "ensalada",
  "nombre": "Ensalada personalizada",
  "cantidad": 1,
  "tamano": {
    "id": "uuid-tamano",
    "nombre": "Mediana",
    "precio": 80.00
  },
  "toppings_base": [
    { "id": "uuid-topping", "nombre": "Lechuga romana" },
    { "id": "uuid-topping", "nombre": "Zanahoria" }
  ],
  "toppings_especiales": [
    { "id": "uuid-topping", "nombre": "Pollo a la plancha", "precio_extra": 25.00 },
    { "id": "uuid-topping", "nombre": "Aguacate", "precio_extra": 15.00 }
  ],
  "aderezo": {
    "id": "uuid-aderezo",
    "nombre": "Ranch"
  },
  "precio_unitario": 120.00,
  "subtotal": 120.00,
  "notas": "Aderezo aparte"
}
```

### Cómo calcular `precio_unitario` de una ensalada

```typescript
const precioUnitario = tamano.precio +
  toppingsEspeciales.reduce((sum, t) => sum + t.precio_extra, 0)
```

---

## Capa de datos — `lib/data/pedidos.ts`

```typescript
import { supabase } from '@/lib/supabase'

// Crear pedido desde WhatsApp (sitio público)
// Usa supabaseAnonClient — no requiere autenticación
export async function createPedidoWhatsapp(data: {
  items: PedidoItem[]
  total: number
  notas?: string
}) {
  const { data: pedido, error } = await supabase
    .from('pedidos')
    .insert({
      origen: 'whatsapp',
      estado: 'pendiente',
      items: data.items,
      total: data.total,
      notas: data.notas ?? null,
    })
    .select('id')
    .single()
  if (error) throw error
  return pedido
}

// Crear pedido desde el POS (requiere autenticación)
export async function createPedidoPOS(data: {
  items: PedidoItem[]
  total: number
  nombre_cliente?: string
  notas?: string
}) {
  const { data: pedido, error } = await supabase
    .from('pedidos')
    .insert({
      origen: 'pos',
      estado: 'confirmado', // POS siempre llega confirmado directo
      items: data.items,
      total: data.total,
      nombre_cliente: data.nombre_cliente ?? null,
      notas: data.notas ?? null,
    })
    .select('id, created_at')
    .single()
  if (error) throw error
  return pedido
}

// Obtener todos los pedidos para el admin (con filtros opcionales)
export async function getPedidos(filtros?: {
  origen?: 'whatsapp' | 'pos'
  estado?: string
  desde?: string   // fecha ISO
  hasta?: string   // fecha ISO
}) {
  let query = supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false })

  if (filtros?.origen) query = query.eq('origen', filtros.origen)
  if (filtros?.estado) query = query.eq('estado', filtros.estado)
  if (filtros?.desde)  query = query.gte('created_at', filtros.desde)
  if (filtros?.hasta)  query = query.lte('created_at', filtros.hasta)

  const { data, error } = await query
  if (error) throw error
  return data
}

// Obtener pedido por ID
export async function getPedidoById(id: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// Actualizar estado de un pedido
export async function updateEstadoPedido(
  id: string,
  estado: 'confirmado' | 'entregado' | 'cancelado'
) {
  const { error } = await supabase
    .from('pedidos')
    .update({ estado, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

// Pedidos pendientes de WhatsApp (para el dashboard del admin)
export async function getPedidosPendientes() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('origen', 'whatsapp')
    .eq('estado', 'pendiente')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Resumen de ventas para reportes
export async function getResumenVentas(desde: string, hasta: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('total, origen, created_at, items')
    .neq('estado', 'cancelado')
    .gte('created_at', desde)
    .lte('created_at', hasta)
  if (error) throw error

  const totalVentas = data.reduce((sum, p) => sum + p.total, 0)
  const totalPedidos = data.length
  const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0
  const pedidosWhatsapp = data.filter(p => p.origen === 'whatsapp').length
  const pedidosPOS = data.filter(p => p.origen === 'pos').length

  return { totalVentas, totalPedidos, ticketPromedio, pedidosWhatsapp, pedidosPOS }
}
```

---

## Tipos TypeScript

```typescript
// types/pedidos.ts

export type OrigenPedido = 'whatsapp' | 'pos'
export type EstadoPedido = 'pendiente' | 'confirmado' | 'entregado' | 'cancelado'

export interface PedidoItemProducto {
  tipo: 'producto'
  producto_id: string
  nombre: string
  cantidad: number
  precio_unitario: number
  subtotal: number
  notas?: string
}

export interface PedidoItemEnsalada {
  tipo: 'ensalada'
  nombre: string
  cantidad: number
  tamano: { id: string; nombre: string; precio: number }
  toppings_base: { id: string; nombre: string }[]
  toppings_especiales: { id: string; nombre: string; precio_extra: number }[]
  aderezo: { id: string; nombre: string }
  precio_unitario: number
  subtotal: number
  notas?: string
}

export type PedidoItem = PedidoItemProducto | PedidoItemEnsalada

export interface Pedido {
  id: string
  origen: OrigenPedido
  nombre_cliente: string | null
  estado: EstadoPedido
  items: PedidoItem[]
  total: number
  notas: string | null
  created_at: string
  updated_at: string
}
```

---

## Generación del mensaje de WhatsApp

```typescript
// lib/whatsapp.ts

export function generarMensajeWhatsapp(items: PedidoItem[]): string {
  const lineas = items.map(item => {
    if (item.tipo === 'producto') {
      const linea = `• ${item.cantidad}x ${item.nombre} — $${item.subtotal.toFixed(2)}`
      return item.notas ? `${linea} (${item.notas})` : linea
    }

    if (item.tipo === 'ensalada') {
      const toppingsBase = item.toppings_base.map(t => t.nombre).join(', ')
      const toppingsEsp = item.toppings_especiales.map(t => t.nombre).join(', ')
      const lineas = [
        `• Ensalada ${item.tamano.nombre} — $${item.precio_unitario.toFixed(2)}`,
        `  Base: ${toppingsBase}`,
        toppingsEsp ? `  Especiales: ${toppingsEsp}` : null,
        `  Aderezo: ${item.aderezo.nombre}`,
        item.notas ? `  Nota: ${item.notas}` : null,
      ]
      return lineas.filter(Boolean).join('\n')
    }
  })

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  return [
    '🥗 *Pedido BarraFresh*',
    '',
    ...lineas,
    '',
    `*Total: $${total.toFixed(2)} MXN*`,
    '',
    '¡Gracias por tu pedido! 🌿',
  ].join('\n')
}

// Abrir WhatsApp con el mensaje
export function abrirWhatsapp(mensaje: string, numeroTelefono: string) {
  const mensajeCodificado = encodeURIComponent(mensaje)
  const url = `https://wa.me/${numeroTelefono}?text=${mensajeCodificado}`
  window.open(url, '_blank')
}
```

---

## Flujo completo del pedido WhatsApp

```typescript
// En el componente CartBar (Client Component)
async function handleFinalizarPedido() {
  setLoading(true)
  try {
    // 1. Guardar en BD primero
    await createPedidoWhatsapp({
      items: cartItems,
      total: calcularTotal(cartItems),
    })
    // 2. Abrir WhatsApp (aunque el paso 1 falle, el cliente no se queda sin comprar)
    const mensaje = generarMensajeWhatsapp(cartItems)
    abrirWhatsapp(mensaje, WHATSAPP_NUMERO)
    // 3. Limpiar carrito
    clearCart()
  } catch (error) {
    // Si falla el guardado, abrir WhatsApp de todas formas
    console.error('Error guardando pedido:', error)
    const mensaje = generarMensajeWhatsapp(cartItems)
    abrirWhatsapp(mensaje, WHATSAPP_NUMERO)
    clearCart()
  } finally {
    setLoading(false)
  }
}
```

---

## Políticas RLS relevantes

```sql
-- Lectura y escritura de pedidos solo para usuarios autenticados
CREATE POLICY "pedidos_authenticated" ON pedidos
  FOR ALL USING (auth.role() = 'authenticated');

-- Excepción: el sitio público puede crear pedidos de WhatsApp (INSERT anónimo)
CREATE POLICY "pedidos_public_insert" ON pedidos
  FOR INSERT WITH CHECK (origen = 'whatsapp' AND estado = 'pendiente');
```

---

## Reglas importantes

- Los pedidos **nunca se eliminan** — solo se cancelan con `estado = 'cancelado'`
- El campo `total` siempre se calcula en el cliente antes de insertar — nunca confiar en cálculos del servidor para el total mostrado al usuario
- Al mostrar pedidos en el admin, los `pendiente` de WhatsApp deben destacarse visualmente (badge amarillo o fondo diferente)
- El campo `items` es JSONB inmutable — una vez creado el pedido, los items no se modifican
- Para reportes, siempre excluir pedidos con `estado = 'cancelado'` de los totales de ventas
