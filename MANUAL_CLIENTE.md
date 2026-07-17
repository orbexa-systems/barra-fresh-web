# Manual de uso — BarraFresh

Guía para el equipo de BarraFresh: cómo administrar el menú, gestionar pedidos y operar el punto de venta.

---

## Acceso al sistema

### Panel de administración

URL: **https://barrafresh.mx/admin**

Ingresar con el correo y contraseña del administrador. Si olvidaste la contraseña, usa la opción
"¿Olvidaste tu contraseña?" en la pantalla de inicio de sesión — recibirás un enlace por correo.

### Punto de Venta (POS)

URL: **https://barrafresh.mx/pos**

Usa las mismas credenciales del administrador. El POS está optimizado para tablets y pantallas táctiles.

---

## Panel de administración

### Menú principal

Al ingresar verás el panel con las secciones:

- **Dashboard** — resumen rápido (pedidos del día, total, últimos pedidos)
- **Menú** — gestiona productos y categorías
- **Pedidos** — historial y estado de pedidos
- **Configurador** — tamaños, toppings y aderezos para ensaladas

---

### Gestión de productos

Ir a **Panel → Menú → Productos**.

#### Crear un producto

1. Clic en **"+ Nuevo producto"**
2. Completar el formulario:
   - **Nombre** *(obligatorio)* — ej. "Verde Detox"
   - **Descripción** — ingredientes o descripción corta
   - **Precio (MXN)** *(obligatorio)*
   - **Orden** — número que determina la posición en el menú (menor número = aparece primero)
   - **Categoría** *(obligatorio)* — seleccionar de la lista
   - **Imagen** — JPG, PNG o WebP, máximo 2 MB
   - **Disponible en el menú** — si está marcado, aparece en el menú público y en el POS
   - **Destacado en el landing** — si está marcado, aparece en la sección de destacados de la página principal
3. Clic en **"Crear producto"**

Un mensaje verde confirmará que el producto se guardó. Los cambios se reflejan en el menú público en segundos.

#### Editar un producto

1. Clic en el ícono de lápiz ✏️ junto al producto
2. Modificar los campos necesarios
3. Clic en **"Guardar cambios"**

#### Activar / desactivar un producto

Usar el interruptor (toggle) en la columna **Disponible**. Al desactivarlo, el producto deja de mostrarse en el menú público y en el POS de forma inmediata. El toggle muestra un spinner mientras se guarda — esperar a que confirme antes de hacer otro cambio.

#### Marcar como destacado

Usar el toggle en la columna **Destacado**. Los productos destacados aparecen en la sección "Nuestros favoritos" de la página principal.

#### Eliminar un producto

Clic en el ícono de basura 🗑️. La acción es permanente — si solo quieres ocultarlo temporalmente, desactívalo en lugar de eliminarlo.

---

### Gestión de categorías

Ir a **Panel → Menú → Categorías**.

#### Crear una categoría

1. Clic en **"+ Nueva categoría"**
2. Escribir el nombre (ej. "Ensaladas", "Jugos", "Smoothies")
3. La categoría se crea activa por defecto

#### Renombrar una categoría

Clic en el nombre de la categoría para editarlo en línea y confirmar con Enter.

#### Activar / desactivar una categoría

Usar el toggle junto a la categoría. Al desactivarla, todos sus productos también dejan de mostrarse en el menú público (aunque sigan marcados como disponibles).

---

### Gestión de pedidos

Ir a **Panel → Pedidos**.

La tabla muestra todos los pedidos ordenados del más reciente al más antiguo.

#### Estados de pedido

| Estado | Significado |
|--------|-------------|
| **Pendiente** | Pedido recibido, aún sin procesar |
| **Confirmado** | Pedido aceptado y en preparación |
| **Entregado** | Pedido entregado al cliente |
| **Cancelado** | Pedido cancelado |

#### Cambiar el estado de un pedido

1. Clic sobre cualquier fila para abrir el detalle del pedido
2. En la sección **"Estado del pedido"**, clic en el estado deseado
3. Un mensaje verde confirmará el cambio. Si hay error, aparecerá un mensaje rojo — intentar de nuevo.

#### Información del pedido

El panel lateral muestra:
- Fecha y hora
- Canal (WhatsApp o POS)
- Nombre del cliente (si se capturó)
- Lista de productos con cantidades y precios
- Notas especiales
- Total

---

### Configurador de ensaladas

Ir a **Panel → Configurador**.

Aquí se gestionan los ingredientes disponibles para armar ensaladas personalizadas en el POS.

#### Tamaños

Define los tamaños disponibles (ej. Chica, Mediana, Grande) con su precio base.

#### Toppings

Ingredientes que el cliente puede añadir. Cada topping tiene:
- **Nombre**
- **Tipo**: base (incluido en el precio) o especial (tiene cargo extra)
- **Precio extra** (solo para toppings especiales)
- **Disponible**: toggle para activar/desactivar

#### Aderezos

Lista de aderezos disponibles (ej. Vinagreta, Caesar, Mostaza-Miel). Cada aderezo tiene nombre y toggle de disponibilidad.

---

## Punto de Venta (POS)

URL: **https://barrafresh.mx/pos**

El POS está diseñado para tomar pedidos en el mostrador con una tablet o computadora.

### Interfaz

- **Izquierda (catálogo)** — productos organizados por categoría
- **Derecha (pedido actual)** — resumen del pedido en curso

En **celular o tablet pequeña**: el catálogo ocupa toda la pantalla. Un botón flotante verde **"Ver pedido (N)"** en la esquina inferior derecha abre el resumen del pedido.

### Tomar un pedido

#### Agregar un producto simple

1. Buscar el producto en el catálogo (usar las pestañas de categorías para filtrar)
2. Clic en el producto — se añade al pedido
3. Para ajustar la cantidad, usar los botones **+** y **−** en el resumen del pedido

#### Armar una ensalada personalizada

1. En el catálogo, clic en la categoría **Ensaladas**
2. Clic en **"Armar ensalada"**
3. Seleccionar:
   - **Tamaño** (determina el precio base)
   - **Toppings base** (incluidos en el precio)
   - **Toppings especiales** (con cargo extra, se muestran los precios)
   - **Aderezo** (opcional)
   - **Notas adicionales** (opcional)
4. Clic en **"Agregar al pedido"**

Cada ensalada personalizada aparece como un ítem separado en el resumen con su desglose de ingredientes.

#### Confirmar el pedido

1. (Opcional) Escribir el nombre del cliente en el campo **"Nombre del cliente"**
2. (Opcional) Añadir notas generales del pedido
3. Verificar el total
4. Clic en **"Confirmar pedido"**

El sistema guarda el pedido y muestra una pantalla de confirmación con el número de pedido. A partir de ese momento el pedido aparece en el panel de administración.

5. Clic en **"Nuevo pedido"** para empezar el siguiente

#### Cancelar un pedido en curso

Clic en **"Cancelar pedido"** en la parte inferior del resumen. Esto limpia el carrito sin guardar nada.

#### Eliminar un ítem del carrito

Clic en el ícono de basura 🗑️ junto al ítem en el resumen del pedido.

---

## Solución de problemas frecuentes

### El producto que guardé no aparece en el menú público

- Verificar que el toggle **Disponible** esté activado
- Verificar que la categoría del producto también esté activa
- Los cambios tardan hasta 5 minutos en reflejarse por el caché. Si es urgente, esperar unos minutos y recargar la página.

### No puedo iniciar sesión

- Verificar que el correo y contraseña sean correctos (distinguen mayúsculas/minúsculas)
- Si olvidaste la contraseña: en la pantalla de login → **"¿Olvidaste tu contraseña?"** → revisar el correo (puede tardar unos minutos; revisar también la carpeta de spam)
- Si el problema persiste, contactar al equipo técnico

### El POS no responde al confirmar un pedido

- Verificar la conexión a internet
- Si el botón muestra "Confirmando…" por más de 10 segundos, aparecerá un mensaje de error — intentar de nuevo
- Si el error persiste, anotar el pedido manualmente y reportar al equipo técnico

### Una imagen de producto no se muestra

- El tamaño máximo permitido es 2 MB — imágenes más grandes no se suben
- Formatos aceptados: JPG, PNG, WebP
- Si la imagen se subió pero no aparece, esperar unos minutos y recargar la página

### El precio del menú público está desactualizado

Los precios en el menú público se actualizan con el caché (máximo 5 minutos). Si necesitas que el cambio sea inmediato, edita y guarda el producto nuevamente — esto fuerza la actualización.

---

## Contacto técnico

Para reportar errores, solicitar nuevas funciones o necesitar asistencia técnica:

- **Equipo**: Orbexa Systems
- **Email de soporte**: siheca2013@gmail.com
