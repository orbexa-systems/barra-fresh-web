---
name: barrafresh-report-agent
description: >
  Agente generador de reportes de ventas para BarraFresh. Consulta Supabase y genera
  reportes detallados en Excel (.xlsx) con ventas, productos más vendidos, ticket
  promedio y desglose por origen (WhatsApp vs POS). Úsalo cuando el usuario pida
  "genera el reporte de ventas", "dame las ventas de hoy/esta semana/este mes",
  "qué productos se vendieron más", "exportar ventas a Excel", "reporte para el dueño"
  o cualquier consulta sobre estadísticas o métricas de ventas de BarraFresh.
---

# BarraFresh — Report Agent

Agente generador de reportes de ventas. Consulta la tabla `pedidos` en Supabase y genera un archivo Excel con el análisis completo del período solicitado.

---

## Cuándo ejecutar este agente

- "genera el reporte de ventas de hoy / esta semana / este mes"
- "qué se vendió más esta semana"
- "dame las métricas del mes"
- "exportar ventas a Excel"
- "reporte para el dueño"
- Cualquier pregunta sobre ventas, ingresos o productos más pedidos

---

## Paso 1: Determinar el período

Si el usuario no especifica el período, pregunta antes de continuar:

> "¿Para qué período quieres el reporte? Hoy, esta semana, este mes, o un rango personalizado (fecha inicio - fecha fin)."

Una vez definido, calcular las fechas en ISO 8601:
```typescript
// Ejemplos
hoy:         desde = '2025-XX-XX 00:00:00', hasta = '2025-XX-XX 23:59:59'
esta semana: desde = lunes de la semana actual 00:00:00
este mes:    desde = primer día del mes actual 00:00:00
```

---

## Paso 2: Consultar Supabase

Ejecutar el siguiente script Node.js para obtener los datos:

```javascript
// reporte_ventas.mjs
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const DESDE = 'FECHA_INICIO'  // reemplazar
const HASTA = 'FECHA_FIN'     // reemplazar

// 1. Obtener todos los pedidos del período (excluir cancelados)
const { data: pedidos, error } = await supabase
  .from('pedidos')
  .select('*')
  .neq('estado', 'cancelado')
  .gte('created_at', DESDE)
  .lte('created_at', HASTA)
  .order('created_at', { ascending: false })

if (error) throw error

// 2. Calcular métricas
const totalVentas = pedidos.reduce((sum, p) => sum + p.total, 0)
const totalPedidos = pedidos.length
const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0
const pedidosWhatsapp = pedidos.filter(p => p.origen === 'whatsapp')
const pedidosPOS = pedidos.filter(p => p.origen === 'pos')

// 3. Calcular productos más vendidos desde JSONB items
const conteoProductos = {}
pedidos.forEach(pedido => {
  pedido.items.forEach(item => {
    const nombre = item.nombre
    if (!conteoProductos[nombre]) {
      conteoProductos[nombre] = { nombre, cantidad: 0, total: 0 }
    }
    conteoProductos[nombre].cantidad += item.cantidad
    conteoProductos[nombre].total += item.subtotal
  })
})

const productosMasVendidos = Object.values(conteoProductos)
  .sort((a, b) => b.cantidad - a.cantidad)
  .slice(0, 10)

console.log(JSON.stringify({
  pedidos,
  metricas: { totalVentas, totalPedidos, ticketPromedio },
  porOrigen: {
    whatsapp: { cantidad: pedidosWhatsapp.length, total: pedidosWhatsapp.reduce((s,p) => s+p.total, 0) },
    pos: { cantidad: pedidosPOS.length, total: pedidosPOS.reduce((s,p) => s+p.total, 0) }
  },
  productosMasVendidos
}, null, 2))
```

```bash
node reporte_ventas.mjs
```

---

## Paso 3: Generar el archivo Excel

Usar la librería `xlsx` para generar el reporte. Instalar si no está:
```bash
npm install xlsx --save-dev
```

### Estructura del Excel — 4 hojas

#### Hoja 1: "Resumen"
| Campo | Valor |
|-------|-------|
| Período | [fecha inicio] al [fecha fin] |
| Total de ventas | $X,XXX.XX MXN |
| Total de pedidos | XX |
| Ticket promedio | $XXX.XX MXN |
| Pedidos WhatsApp | XX (XX%) |
| Pedidos POS | XX (XX%) |
| Ventas WhatsApp | $X,XXX.XX MXN |
| Ventas POS | $X,XXX.XX MXN |
| Generado el | [fecha y hora actual] |

#### Hoja 2: "Productos más vendidos"
| # | Producto | Cantidad vendida | Total generado |
|---|----------|------------------|----------------|
| 1 | Smoothie Açaí | 24 | $2,640.00 |
| 2 | ... | ... | ... |

Top 10 productos ordenados por cantidad.

#### Hoja 3: "Detalle de pedidos"
| Fecha | Hora | Origen | Cliente | Estado | Total | # Ítems |
|-------|------|--------|---------|--------|-------|---------|
| 2025-07-01 | 13:45 | WhatsApp | — | Entregado | $220.00 | 2 |

Un pedido por fila, ordenado por fecha descendente.

#### Hoja 4: "Detalle de ítems"
| Fecha | Pedido ID | Tipo | Producto | Cantidad | Precio Unit. | Subtotal | Notas |
|-------|-----------|------|----------|----------|--------------|----------|-------|
| 2025-07-01 | abc-123 | Producto | Smoothie Açaí | 2 | $110.00 | $220.00 | — |

Un ítem por fila — permite analizar combinaciones de productos.

### Script de generación Excel

```javascript
// generar_reporte.mjs
import * as XLSX from 'xlsx'
import { readFileSync } from 'fs'

const datos = JSON.parse(readFileSync('datos_reporte.json', 'utf8'))
const { pedidos, metricas, porOrigen, productosMasVendidos } = datos

const wb = XLSX.utils.book_new()

// Hoja 1: Resumen
const resumenData = [
  ['REPORTE DE VENTAS — BARRAFRESH'],
  [],
  ['Período', `${DESDE} al ${HASTA}`],
  ['Total de ventas', `$${metricas.totalVentas.toFixed(2)} MXN`],
  ['Total de pedidos', metricas.totalPedidos],
  ['Ticket promedio', `$${metricas.ticketPromedio.toFixed(2)} MXN`],
  [],
  ['DESGLOSE POR ORIGEN'],
  ['Pedidos WhatsApp', porOrigen.whatsapp.cantidad, `$${porOrigen.whatsapp.total.toFixed(2)} MXN`],
  ['Pedidos POS', porOrigen.pos.cantidad, `$${porOrigen.pos.total.toFixed(2)} MXN`],
  [],
  ['Generado el', new Date().toLocaleString('es-MX')],
]
const wsResumen = XLSX.utils.aoa_to_sheet(resumenData)
wsResumen['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 20 }]
XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen')

// Hoja 2: Productos más vendidos
const productosHeader = [['#', 'Producto', 'Cantidad vendida', 'Total generado']]
const productosRows = productosMasVendidos.map((p, i) => [
  i + 1, p.nombre, p.cantidad, `$${p.total.toFixed(2)} MXN`
])
const wsProductos = XLSX.utils.aoa_to_sheet([...productosHeader, ...productosRows])
wsProductos['!cols'] = [{ wch: 4 }, { wch: 30 }, { wch: 18 }, { wch: 18 }]
XLSX.utils.book_append_sheet(wb, wsProductos, 'Productos más vendidos')

// Hoja 3: Detalle de pedidos
const pedidosHeader = [['Fecha', 'Hora', 'Origen', 'Cliente', 'Estado', 'Total', '# Ítems']]
const pedidosRows = pedidos.map(p => {
  const fecha = new Date(p.created_at)
  return [
    fecha.toLocaleDateString('es-MX'),
    fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    p.origen === 'whatsapp' ? 'WhatsApp' : 'POS',
    p.nombre_cliente ?? '—',
    p.estado.charAt(0).toUpperCase() + p.estado.slice(1),
    `$${p.total.toFixed(2)}`,
    p.items.reduce((sum, item) => sum + item.cantidad, 0),
  ]
})
const wsPedidos = XLSX.utils.aoa_to_sheet([...pedidosHeader, ...pedidosRows])
wsPedidos['!cols'] = [{ wch: 12 }, { wch: 8 }, { wch: 12 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 8 }]
XLSX.utils.book_append_sheet(wb, wsPedidos, 'Detalle de pedidos')

// Hoja 4: Detalle de ítems
const itemsHeader = [['Fecha', 'Pedido ID', 'Tipo', 'Producto', 'Cantidad', 'Precio Unit.', 'Subtotal', 'Notas']]
const itemsRows = []
pedidos.forEach(p => {
  const fecha = new Date(p.created_at).toLocaleDateString('es-MX')
  p.items.forEach(item => {
    itemsRows.push([
      fecha,
      p.id.substring(0, 8) + '...',
      item.tipo === 'producto' ? 'Producto' : 'Ensalada',
      item.nombre,
      item.cantidad,
      `$${item.precio_unitario.toFixed(2)}`,
      `$${item.subtotal.toFixed(2)}`,
      item.notas ?? '—',
    ])
  })
})
const wsItems = XLSX.utils.aoa_to_sheet([...itemsHeader, ...itemsRows])
wsItems['!cols'] = [{ wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 30 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 20 }]
XLSX.utils.book_append_sheet(wb, wsItems, 'Detalle de ítems')

// Guardar archivo
const nombreArchivo = `reporte_barrafresh_${DESDE.split(' ')[0]}_${HASTA.split(' ')[0]}.xlsx`
XLSX.writeFile(wb, nombreArchivo)
console.log(`✅ Reporte generado: ${nombreArchivo}`)
```

```bash
node generar_reporte.mjs
```

---

## Paso 4: Presentar el reporte

Al terminar, presentar el archivo Excel generado al usuario y mostrar un resumen en texto:

```
📊 REPORTE BARRAFRESH — [período]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Total ventas:     $X,XXX.XX MXN
📦 Total pedidos:    XX
🧾 Ticket promedio:  $XXX.XX MXN

📱 WhatsApp:  XX pedidos — $X,XXX.XX MXN
🖥️  POS:       XX pedidos — $X,XXX.XX MXN

🏆 TOP 5 PRODUCTOS
  1. [nombre] — XX vendidos
  2. [nombre] — XX vendidos
  3. [nombre] — XX vendidos
  4. [nombre] — XX vendidos
  5. [nombre] — XX vendidos

📁 Archivo: reporte_barrafresh_[fecha].xlsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Reglas del agente

- Siempre excluir pedidos con `estado = 'cancelado'` de todos los cálculos
- Si no hay pedidos en el período, generar el Excel de todas formas con los encabezados y una nota "Sin pedidos en este período"
- El archivo Excel debe nombrarse con las fechas del período: `reporte_barrafresh_2025-07-01_2025-07-31.xlsx`
- Los montos siempre en MXN con 2 decimales
- Las fechas siempre en formato local mexicano (dd/mm/yyyy)
- Si falla la conexión a Supabase, reportar el error claramente y sugerir verificar las variables de entorno
