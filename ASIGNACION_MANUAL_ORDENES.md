# 📦 Módulo de Asignación Manual de Órdenes a Riders

Sistema completo para asignar manualmente órdenes pendientes a riders disponibles desde el dashboard.

---

## 🎯 Funcionalidades Implementadas

### Backend (API)

#### 1. **PATCH /api/orders/[id]/assign**
Asigna un rider a una orden específica.

**Request:**
```json
{
  "riderId": 5
}
```

**Response (éxito):**
```json
{
  "success": true,
  "message": "Orden asignada correctamente",
  "order": {
    "id": 123,
    "status": "pending",
    "customer": {
      "name": "Juan",
      "lastname": "Pérez"
    },
    "rider": {
      "id": 5,
      "name": "Carlos García",
      "email": "carlos@example.com",
      "phone": "+34612345678",
      "vehicle": {
        "type": "MOTORCYCLE",
        "licensePlate": "ABC-123"
      }
    },
    "pickupAddress": "Calle Principal 123",
    "deliveryAddress": "Avenida Central 456"
  }
}
```

**Validaciones:**
- ✅ Usuario autenticado
- ✅ Orden existe
- ✅ Orden está en estado "pending"
- ✅ Rider existe y está activo
- ✅ Rider no está en otra entrega (status != ON_DELIVERY)

**Efectos:**
1. Asigna el rider a la orden
2. Cambia el status del rider a `ON_DELIVERY`
3. Actualiza la orden con el riderId

---

#### 2. **GET /api/orders**
Mejorado para filtrar órdenes por estado y obtener todas las órdenes (admin).

**Query Parameters:**
- `status` - Filtrar por estado (pending, onroute, delivered, canceled)
- `all=true` - Obtener todas las órdenes (para admin, no solo del usuario)

**Ejemplos:**
```bash
# Obtener solo órdenes pendientes
GET /api/orders?status=pending

# Obtener todas las órdenes pendientes (admin)
GET /api/orders?status=pending&all=true

# Obtener todas las órdenes
GET /api/orders?all=true
```

**Response:**
```json
{
  "orders": [
    {
      "id": 123,
      "customerId": 45,
      "riderId": 5,
      "status": "pending",
      "pickupAddress": "...",
      "deliveryAddress": "...",
      "distanceKm": 3.5,
      "estimatedPrice": 12.50,
      "customer": {
        "id": 45,
        "name": "Juan",
        "lastname": "Pérez"
      },
      "rider": {
        "id": 5,
        "phone": "+34612345678",
        "status": "ON_DELIVERY",
        "user": {
          "name": "Carlos García",
          "email": "carlos@example.com"
        },
        "vehicle": {
          "type": "MOTORCYCLE",
          "licensePlate": "ABC-123"
        }
      }
    }
  ]
}
```

---

#### 3. **GET /api/riders/available**
Ya existente, devuelve todos los riders disponibles (status IDLE y activos).

---

### Frontend (Dashboard)

#### 1. **Página de Asignación Manual** (`/dashboard/orders/assign`)

Página dedicada para asignar órdenes a riders disponibles.

**Características:**
- 📊 **Stats en tiempo real:**
  - Órdenes pendientes
  - Riders disponibles
  - Ratio órdenes/riders

- 📋 **Tabla de Órdenes Pendientes:**
  - ID de orden
  - Cliente
  - Dirección de recogida
  - Dirección de entrega
  - Distancia (km)
  - Precio estimado
  - Selector de rider con botón "Asignar"

- 👥 **Grid de Riders Disponibles:**
  - Avatar/inicial del rider
  - Nombre
  - Teléfono
  - Tipo de vehículo y placa
  - Rating (estrellas)
  - Cantidad de entregas completadas

- 🔄 **Botón de Actualizar:**
  - Recarga datos en tiempo real

**Funcionalidad:**
1. Carga todas las órdenes pendientes
2. Carga todos los riders disponibles
3. Permite seleccionar un rider para cada orden
4. Al asignar, hace PATCH a `/api/orders/[id]/assign`
5. Muestra toast de éxito/error
6. Recarga automáticamente los datos después de asignar

---

#### 2. **Página de Órdenes Mejorada** (`/dashboard/orders`)

**Mejoras implementadas:**
- ➕ **Nueva columna "Rider":** Muestra el nombre del rider asignado o "Sin asignar"
- 🔵 **Botón "Asignar Riders":** En el header, lleva a `/dashboard/orders/assign`
- 🎯 **Botón "Asignar" por orden:** Aparece solo en órdenes pendientes sin rider
- 👁️ **Visualización clara:** Indica qué órdenes tienen rider y cuáles no

---

#### 3. **Menú de Navegación**

Nuevo item agregado:
- **"Asignar Órdenes"** → `/dashboard/orders/assign`

---

## 🗂️ Estructura de Archivos

```
src/
├── app/
│   ├── api/
│   │   └── orders/
│   │       ├── route.ts                    # GET mejorado con filtros
│   │       └── [id]/
│   │           └── assign/
│   │               └── route.ts            # PATCH para asignar rider
│   └── (dashboard)/
│       └── dashboard/
│           ├── layout.tsx                  # Menú actualizado
│           └── orders/
│               ├── page.tsx                # Tabla de órdenes mejorada
│               └── assign/
│                   └── page.tsx            # Nueva página de asignación
└── lib/
    └── rider-service.ts                    # RiderService.assignOrder() ya existente
```

---

## 🔄 Flujo de Asignación

```mermaid
graph TD
    A[Dashboard - Ver Órdenes] --> B{¿Orden pendiente sin rider?}
    B -->|Sí| C[Mostrar botón 'Asignar']
    B -->|No| D[Solo mostrar 'Ver']
    C --> E[Click 'Asignar Riders']
    E --> F[Página /dashboard/orders/assign]
    F --> G[Cargar órdenes pendientes]
    F --> H[Cargar riders disponibles]
    G --> I[Mostrar tabla con selector]
    H --> I
    I --> J[Usuario selecciona rider]
    J --> K[Click 'Asignar']
    K --> L[PATCH /api/orders/[id]/assign]
    L --> M{¿Éxito?}
    M -->|Sí| N[Toast éxito]
    M -->|No| O[Toast error]
    N --> P[Recargar datos]
    O --> P
    P --> F
```

---

## 🚀 Uso

### Desde la Página de Órdenes:

1. Ve a **Dashboard → Pedidos**
2. Busca órdenes con estado "Pendiente" y "Sin asignar"
3. Click en **"Asignar"** (botón azul)
4. Serás redirigido a `/dashboard/orders/assign`

### Desde el Menú:

1. Click en **"Asignar Órdenes"** en el menú lateral
2. Verás todas las órdenes pendientes
3. Para cada orden, selecciona un rider del dropdown
4. Click en **"Asignar"**
5. ✅ ¡Listo! La orden queda asignada

---

## 🔍 Validaciones de Negocio

El sistema valida automáticamente:

### ❌ No se puede asignar si:
- La orden no está en estado "pending"
- El rider no existe
- El rider no está activo (`isActive: false`)
- El rider ya está en otra entrega (`status: ON_DELIVERY`)
- El rider está offline (`status: OFFLINE`)

### ✅ Solo se permite asignar si:
- Orden en estado "pending"
- Rider existe, está activo y disponible (`status: IDLE`)

---

## 📊 Componentes y Tipos

### Tipos TypeScript

**Order** (Frontend):
```typescript
type Order = {
  id: number;
  customerId: number;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  distanceKm: number;
  estimatedPrice: number;
  createdAt: string;
  customer: {
    id: number;
    name: string;
    lastname: string;
  };
  rider: null | {
    id: number;
    phone: string;
    user: {
      name: string;
      email: string;
    };
  };
};
```

**Rider** (Frontend):
```typescript
type Rider = {
  id: number;
  phone: string;
  status: string;
  isActive: boolean;
  rating: number | null;
  completedOrders: number;
  user: {
    name: string;
    email: string;
  };
  vehicle: {
    type: string;
    licensePlate: string;
  } | null;
};
```

---

## 🎨 UI/UX

### Colores utilizados:
- **Pendiente:** `var(--color-warning)` - Amarillo/naranja
- **En ruta:** `var(--color-info)` - Azul
- **Entregado:** `var(--color-success)` - Verde
- **Cancelado:** `var(--color-danger)` - Rojo
- **Asignar:** `var(--color-info)` - Azul

### Feedback al usuario:
- ✅ Toast de éxito al asignar
- ❌ Toast de error si falla
- 🔄 Loading spinner mientras asigna
- 📊 Stats en tiempo real
- 💫 Animaciones suaves

---

## 🔐 Seguridad

- ✅ Autenticación requerida en todos los endpoints
- ✅ Validación de permisos (solo usuarios autenticados)
- ✅ Validación de datos de entrada
- ✅ Manejo de errores robusto
- ✅ Transacciones atómicas en la asignación

---

## 🧪 Testing Manual

### Probar asignación exitosa:
1. Crear una orden nueva (estado "pending")
2. Crear un rider activo con estado "IDLE"
3. Ir a `/dashboard/orders/assign`
4. Asignar el rider a la orden
5. Verificar que la orden ahora tiene rider asignado
6. Verificar que el rider cambió a estado "ON_DELIVERY"

### Probar validaciones:
1. Intentar asignar un rider que ya está en entrega → Error
2. Intentar asignar a una orden que no está pending → Error
3. Intentar asignar un rider inactivo → Error

---

## 📝 Próximas Mejoras Sugeridas

- [ ] Filtros avanzados en la página de asignación
- [ ] Búsqueda de riders por nombre/vehículo
- [ ] Asignación automática basada en proximidad GPS
- [ ] Notificaciones push al rider cuando se asigna
- [ ] Historial de asignaciones
- [ ] Reasignación de órdenes
- [ ] Asignación masiva (múltiples órdenes a la vez)
- [ ] Vista de mapa con órdenes y riders
- [ ] Estimación de tiempo de llegada

---

## 🐛 Troubleshooting

### "Error al asignar la orden"
- Verifica que el rider esté disponible (IDLE)
- Verifica que la orden esté en estado "pending"
- Revisa la consola del navegador y servidor para más detalles

### "No hay riders disponibles"
- Verifica que haya riders con estado "IDLE"
- Verifica que los riders estén activos (`isActive: true`)
- Actualiza la página con el botón de refresh

### "No hay órdenes pendientes"
- Crea órdenes nuevas desde `/dashboard/orders/new`
- Verifica que no estén ya asignadas

---

## ✅ Checklist de Implementación

- [x] API endpoint PATCH /api/orders/[id]/assign
- [x] Mejorar GET /api/orders con filtros
- [x] Página de asignación manual
- [x] Actualizar página de órdenes
- [x] Agregar al menú de navegación
- [x] Validaciones de negocio
- [x] UI/UX completa
- [x] Manejo de errores
- [x] Feedback al usuario (toasts)
- [x] Documentación

---

**Desarrollado por:** Cascade AI  
**Fecha:** Octubre 2025  
**Versión:** 1.0.0
