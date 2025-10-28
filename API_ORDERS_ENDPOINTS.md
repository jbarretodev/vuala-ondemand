# 📦 API de Órdenes

[← Volver al índice](API_ENDPOINTS_INDEX.md)

## Descripción General

Endpoints para la gestión de órdenes de delivery, incluyendo creación, listado y asignación de repartidores.

**⚠️ Autenticación Requerida:** Todos los endpoints requieren sesión activa.

---

## 📋 Endpoints Disponibles

### 1. Crear Orden
**POST** `/api/orders`

Crea una nueva orden de delivery asociada al cliente autenticado.

#### Request Body
```json
{
  "pickupAddress": "Calle Origen 123",
  "deliveryAddress": "Calle Destino 456",
  "isScheduled": false,
  "scheduledDate": null,
  "scheduledTime": null,
  "distanceKm": 5.2,
  "estimatedTime": "25 min",
  "estimatedPrice": 15.50
}
```

#### Campos Requeridos
- `pickupAddress` - Dirección de recogida
- `deliveryAddress` - Dirección de entrega
- `distanceKm` - Distancia en kilómetros
- `estimatedTime` - Tiempo estimado de entrega
- `estimatedPrice` - Precio estimado

#### Campos Opcionales
- `isScheduled` - Si la orden es programada (default: false)
- `scheduledDate` - Fecha programada (requerido si isScheduled=true)
- `scheduledTime` - Hora programada (requerido si isScheduled=true)

#### Validaciones
- Usuario debe estar autenticado
- Usuario debe tener un cliente asociado
- Direcciones de recogida y entrega son obligatorias
- Información de ruta (distancia, tiempo, precio) es obligatoria
- Si es programada, fecha y hora son requeridas

#### Proceso de Creación
1. Verifica autenticación del usuario
2. Obtiene el cliente asociado al usuario
3. Valida los datos de entrada
4. Crea la orden con estado "pending"
5. Asigna totalAmount igual a estimatedPrice
6. Retorna la orden creada con información del cliente

#### Response Success (201 Created)
```json
{
  "success": true,
  "order": {
    "id": 1,
    "customer": {
      "name": "Juan",
      "lastname": "Pérez"
    },
    "pickupAddress": "Calle Origen 123",
    "deliveryAddress": "Calle Destino 456",
    "isScheduled": false,
    "scheduledDate": null,
    "scheduledTime": null,
    "distanceKm": 5.2,
    "estimatedTime": "25 min",
    "estimatedPrice": 15.50,
    "totalAmount": 15.50,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Response Error (401 Unauthorized)
```json
{
  "error": "No autenticado"
}
```

#### Response Error (400 Bad Request)
```json
{
  "error": "Direcciones de recogida y entrega son requeridas"
}
```

```json
{
  "error": "Información de ruta incompleta"
}
```

```json
{
  "error": "Fecha y hora son requeridas para órdenes programadas"
}
```

```json
{
  "error": "No hay cliente asociado a este usuario"
}
```

#### Response Error (404 Not Found)
```json
{
  "error": "Usuario no encontrado"
}
```

---

### 2. Listar Órdenes
**GET** `/api/orders`

Obtiene las órdenes del usuario autenticado o todas las órdenes (si es admin).

#### Query Parameters
| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `status` | string | No | - | Filtrar por estado (pending, assigned, in_transit, completed, cancelled) |
| `all` | boolean | No | false | Obtener todas las órdenes (solo admin) |

#### Estados de Orden Disponibles
- `pending` - Pendiente de asignación
- `assigned` - Asignada a repartidor
- `in_transit` - En tránsito
- `completed` - Completada
- `cancelled` - Cancelada

#### Response Success (200 OK)
```json
{
  "orders": [
    {
      "id": 1,
      "customerId": 1,
      "customer": {
        "id": 1,
        "name": "Juan",
        "lastname": "Pérez"
      },
      "riderId": 2,
      "rider": {
        "id": 2,
        "phone": "123456789",
        "status": "ON_DELIVERY",
        "user": {
          "id": 10,
          "name": "Carlos",
          "email": "carlos@ejemplo.com",
          "avatar": null
        },
        "vehicle": {
          "id": 1,
          "type": "MOTORCYCLE",
          "brand": "Honda",
          "model": "XR150",
          "licensePlate": "ABC123"
        }
      },
      "pickupAddress": "Calle Origen 123",
      "deliveryAddress": "Calle Destino 456",
      "isScheduled": false,
      "scheduledDate": null,
      "scheduledTime": null,
      "distanceKm": 5.2,
      "estimatedTime": "25 min",
      "estimatedPrice": 15.50,
      "totalAmount": 15.50,
      "status": "in_transit",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T01:00:00.000Z"
    }
  ]
}
```

#### Filtros Automáticos
- **Usuario normal:** Solo ve sus propias órdenes
- **Con `all=true`:** Ve todas las órdenes del sistema
- **Con `status`:** Filtra por estado específico

#### Response Error (401 Unauthorized)
```json
{
  "error": "No autenticado"
}
```

#### Response Error (404 Not Found)
```json
{
  "error": "Usuario no encontrado"
}
```

---

### 3. Asignar Repartidor a Orden
**PATCH** `/api/orders/[id]/assign`

Asigna manualmente un repartidor a una orden pendiente.

#### URL Parameters
- `id` - ID de la orden (number)

#### Request Body
```json
{
  "riderId": 2
}
```

#### Campos Requeridos
- `riderId` - ID del repartidor a asignar

#### Validaciones
- Usuario debe estar autenticado
- La orden debe existir
- La orden debe estar en estado "pending"
- El repartidor debe existir
- El repartidor debe estar activo (isActive=true)
- El repartidor no debe estar en otra entrega (status != ON_DELIVERY)

#### Proceso de Asignación
1. Verifica que la orden exista y esté pendiente
2. Verifica que el repartidor exista y esté disponible
3. Utiliza RiderService.assignOrder() para:
   - Actualizar el estado del repartidor a "ON_DELIVERY"
   - Asignar el riderId a la orden
   - Cambiar el estado de la orden a "assigned"

#### Response Success (200 OK)
```json
{
  "success": true,
  "message": "Orden asignada correctamente",
  "order": {
    "id": 1,
    "status": "assigned",
    "customer": {
      "name": "Juan",
      "lastname": "Pérez"
    },
    "rider": {
      "id": 2,
      "name": "Carlos",
      "email": "carlos@ejemplo.com",
      "phone": "123456789",
      "vehicle": {
        "type": "MOTORCYCLE",
        "brand": "Honda",
        "model": "XR150"
      }
    },
    "pickupAddress": "Calle Origen 123",
    "deliveryAddress": "Calle Destino 456"
  }
}
```

#### Response Error (400 Bad Request)
```json
{
  "error": "ID de orden inválido"
}
```

```json
{
  "error": "ID de rider requerido"
}
```

```json
{
  "error": "La orden está en estado: completed. Solo se pueden asignar órdenes pendientes."
}
```

```json
{
  "error": "El rider no está activo"
}
```

```json
{
  "error": "El rider ya está en una entrega"
}
```

#### Response Error (404 Not Found)
```json
{
  "error": "Orden no encontrada"
}
```

```json
{
  "error": "Rider no encontrado"
}
```

---

## 📝 Ejemplos de Uso

### Crear Orden Inmediata
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "pickupAddress": "Restaurante Los Sabores, Av. Principal 123",
    "deliveryAddress": "Edificio Torres, Piso 5, Apt 502",
    "isScheduled": false,
    "distanceKm": 3.5,
    "estimatedTime": "20 min",
    "estimatedPrice": 12.00
  }'
```

### Crear Orden Programada
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "pickupAddress": "Restaurante Los Sabores",
    "deliveryAddress": "Edificio Torres",
    "isScheduled": true,
    "scheduledDate": "2024-01-05",
    "scheduledTime": "14:30",
    "distanceKm": 3.5,
    "estimatedTime": "20 min",
    "estimatedPrice": 12.00
  }'
```

### Listar Órdenes del Usuario
```bash
curl -X GET "http://localhost:3000/api/orders" \
  -H "Cookie: next-auth.session-token=..."
```

### Listar Órdenes Pendientes
```bash
curl -X GET "http://localhost:3000/api/orders?status=pending" \
  -H "Cookie: next-auth.session-token=..."
```

### Listar Todas las Órdenes (Admin)
```bash
curl -X GET "http://localhost:3000/api/orders?all=true" \
  -H "Cookie: next-auth.session-token=..."
```

### Asignar Repartidor
```bash
curl -X PATCH http://localhost:3000/api/orders/1/assign \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "riderId": 2
  }'
```

---

## 🔄 Flujo de Estados de Orden

```
pending → assigned → in_transit → completed
    ↓
cancelled (en cualquier momento antes de completar)
```

### Descripción de Estados
1. **pending** - Orden creada, esperando asignación de repartidor
2. **assigned** - Repartidor asignado, listo para recoger
3. **in_transit** - Orden en tránsito hacia el destino
4. **completed** - Orden entregada exitosamente
5. **cancelled** - Orden cancelada por usuario o sistema

---

## 🔗 Recursos Relacionados
- [Módulo de Repartidores](API_RIDERS_ENDPOINTS.md)
- [Módulo de Clientes](API_CUSTOMERS_ENDPOINTS.md)
- [RiderService](../src/lib/rider-service.ts)
