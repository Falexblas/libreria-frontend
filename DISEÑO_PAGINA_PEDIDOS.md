# 📦 Diseño de la Página de Pedidos

## 🎨 Vista General

La página de pedidos muestra todos los pedidos del usuario con un diseño moderno, limpio y fácil de entender.

---

## 📱 Estructura de la Página

```
┌─────────────────────────────────────────────────────────────┐
│  🛍️ Mis Pedidos                                             │
│  Revisa el estado de tus compras                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Pedido #42    │ 21 Oct 2025  │ S/123.45  │ 🟡 Pendiente│ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ Detalles del pedido:                                   │ │
│  │ 💳 Método de pago: Tarjeta de crédito/débito          │ │
│  │ 📍 Dirección: Av. Larco 1234, Miraflores, Lima        │ │
│  │ 📞 Teléfono: 999 888 777                              │ │
│  │                                                         │ │
│  │ ℹ️ Nota: Llamar antes de entregar                      │ │
│  │                                                         │ │
│  │ Timeline:                                              │ │
│  │ ✅ Pedido realizado ──── ⏳ En camino ──── ⬜ Entregado │ │
│  │                                                         │ │
│  │ [👁️ Ver detalle]  [📄 Descargar factura]              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Pedido #41    │ 18 Oct 2025  │ S/89.90   │ 🚚 En camino│ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Pedido #40    │ 15 Oct 2025  │ S/156.00  │ ✅ Entregado│ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Componentes Principales

### **1. Header de la Página**
```
🛍️ Mis Pedidos
Revisa el estado de tus compras
─────────────────────────────
```

### **2. Tarjeta de Pedido**
Cada pedido se muestra en una tarjeta con:

#### **Header de la Tarjeta:**
```
┌─────────────────────────────────────────────────┐
│ Pedido      │ Fecha        │ Total    │ Estado  │
│ #42         │ 21 Oct 2025  │ S/123.45 │ 🟡 Pend │
└─────────────────────────────────────────────────┘
```

#### **Cuerpo de la Tarjeta:**
- **Detalles del pedido:**
  - 💳 Método de pago
  - 📍 Dirección de envío
  - 📞 Teléfono de contacto
  - 📮 Código postal

- **Nota (si existe):**
  ```
  ℹ️ Nota: Llamar antes de entregar
  ```

- **Timeline de Estado:**
  ```
  ✅ Pedido realizado ──── 🚚 En camino ──── 📦 Entregado
     21 Oct, 10:30am      Pendiente         Pendiente
  ```

- **Acciones:**
  ```
  [👁️ Ver detalle]  [📄 Descargar factura]
  ```

---

## 🎨 Estados del Pedido

### **1. Pendiente** 🟡
```
Badge: Amarillo
Icono: 🕐 (reloj)
Texto: "Pendiente"
Timeline: Solo primer paso activo
```

### **2. En camino** 🔵
```
Badge: Azul
Icono: 🚚 (camión)
Texto: "En camino"
Timeline: Primeros dos pasos activos
```

### **3. Entregado** 🟢
```
Badge: Verde
Icono: ✅ (check)
Texto: "Entregado"
Timeline: Todos los pasos activos
Botón extra: "Descargar factura"
```

---

## 📊 Timeline Visual

### **Estado: Pendiente**
```
✅ Pedido realizado ──── ⏳ En camino ──── ⬜ Entregado
   21 Oct, 10:30am      Pendiente         Pendiente
   (activo)             (inactivo)        (inactivo)
```

### **Estado: En camino**
```
✅ Pedido realizado ──── ✅ En camino ──── ⏳ Entregado
   21 Oct, 10:30am      22 Oct, 2:15pm    Pendiente
   (activo)             (activo)          (inactivo)
```

### **Estado: Entregado**
```
✅ Pedido realizado ──── ✅ En camino ──── ✅ Entregado
   21 Oct, 10:30am      22 Oct, 2:15pm    23 Oct, 5:45pm
   (activo)             (activo)          (activo)
```

---

## 🎨 Paleta de Colores

```css
/* Estados */
Pendiente:  #ffc107 (amarillo)
En camino:  #0dcaf0 (azul)
Entregado:  #198754 (verde)

/* Fondo */
Página:     #f8f9fa (gris claro)
Tarjetas:   #ffffff (blanco)

/* Texto */
Principal:  #212529 (negro)
Secundario: #6c757d (gris)
Primario:   #0d6efd (azul)

/* Timeline */
Activo:     #0d6efd (azul)
Inactivo:   #e9ecef (gris claro)
```

---

## 📱 Diseño Responsive

### **Desktop (>768px):**
```
┌─────────────────────────────────────────────────┐
│ Pedido #42  │ 21 Oct  │ S/123.45  │ 🟡 Pendiente│
├─────────────────────────────────────────────────┤
│ Timeline horizontal                              │
│ ✅ ──────── ⏳ ──────── ⬜                       │
└─────────────────────────────────────────────────┘
```

### **Mobile (<768px):**
```
┌──────────────────────┐
│ Pedido #42           │
│ 21 Oct 2025          │
│ S/123.45             │
│ 🟡 Pendiente         │
├──────────────────────┤
│ Timeline vertical    │
│ ✅ Pedido realizado  │
│ │                    │
│ ⏳ En camino         │
│ │                    │
│ ⬜ Entregado         │
└──────────────────────┘
```

---

## 🎯 Características Especiales

### **1. Sin Pedidos:**
```
┌─────────────────────────────┐
│                             │
│         📦                  │
│    (icono grande)           │
│                             │
│  No tienes pedidos aún      │
│                             │
│  Cuando realices tu primera │
│  compra, aparecerá aquí     │
│                             │
│  [📚 Explorar libros]       │
│                             │
└─────────────────────────────┘
```

### **2. Hover en Tarjetas:**
```
Efecto: Elevación suave
Transform: translateY(-2px)
Shadow: Más pronunciada
Transición: 0.2s ease
```

### **3. Loading State:**
```
┌─────────────────────────────┐
│                             │
│         ⏳                  │
│    (spinner animado)        │
│                             │
│  Cargando tus pedidos...    │
│                             │
└─────────────────────────────┘
```

---

## 🔄 Interacciones

### **Botón "Ver detalle":**
- Muestra modal o navega a página de detalle
- Muestra todos los libros del pedido
- Información completa de envío

### **Botón "Descargar factura":**
- Solo visible si estado = "entregado"
- Descarga PDF con factura
- Incluye detalles del pedido

---

## 📊 Información Mostrada

### **Por Pedido:**
- ✅ Número de pedido
- ✅ Fecha y hora
- ✅ Total pagado
- ✅ Estado actual
- ✅ Método de pago
- ✅ Dirección de envío
- ✅ Teléfono de contacto
- ✅ Código postal
- ✅ Notas adicionales
- ✅ Timeline de progreso

---

## 🎉 Resultado Final

**Una página moderna, intuitiva y profesional que:**
- ✅ Muestra claramente el estado de cada pedido
- ✅ Tiene un timeline visual fácil de entender
- ✅ Es completamente responsive
- ✅ Tiene animaciones suaves
- ✅ Proporciona toda la información necesaria
- ✅ Permite acciones rápidas (ver detalle, descargar factura)

**¡Como Amazon, Mercado Libre y las mejores tiendas online!** 🚀
