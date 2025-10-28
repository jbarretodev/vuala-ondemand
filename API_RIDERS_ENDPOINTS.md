# 🏍️ API de Repartidores

[← Volver al índice](API_ENDPOINTS_INDEX.md)

## Descripción General

Endpoints para la gestión completa de repartidores (riders), incluyendo CRUD, gestión de ubicaciones en tiempo real y asignación de órdenes.

**⚠️ Autenticación Requerida:** Todos los endpoints requieren sesión activa.

---

## 📋 Endpoints Disponibles

### 1. Listar Repartidores
**GET** `/api/riders`

Obtiene todos los repartidores con paginación y filtros.

#### Query Parameters
| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `page` | number | No | 1 | Número de página |
| `limit` | number | No | 10 | Repartidores por página |
| `status` | string | No | - | Filtrar por estado (IDLE, ON_DELIVERY, OFFLINE) |
| `isActive` | boolean | No | - | Filtrar por estado activo/inactivo |

#### Estados de Repartidor Disponibles
- `IDLE` - Disponible para órdenes
- `ON_DELIVERY` - En una entrega activa
- `OFFLINE` - Fuera de línea

#### Response Success (200 OK)
```json
{
  "riders": [
    {
      "id": 1,
      "userId": 10,
      "phone": "123456789",
      "licenseNumber": "LIC123456",
      "status": "IDLE",
      "isActive": true,
      "rating": 4.5,
      "totalDeliveries": 150,
      "currentLat": -12.0464,
      "currentLng": -77.0428,
      "lastLocationUpdate": "2024-01-01T12:00:00.000Z",
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
        "year": 2022,
        "licensePlate": "ABC123",
        "color": "Rojo"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 25,
  "pages": 3,
  "currentPage": 1
}
```

#### Response Error (401 Unauthorized)
```json
{
  "error": "No autorizado"
}
```

---

### 2. Crear Repartidor
**POST** `/api/riders`

Crea un nuevo repartidor asociado a un usuario existente.

**🔒 Permisos:** Solo usuarios con rol "admin" pueden crear repartidores.

#### Request Body
```json
{
  "userId": 10,
  "phone": "987654321",
  "licenseNumber": "LIC789456",
  "vehicle": {
    "type": "MOTORCYCLE",
    "brand": "Yamaha",
    "model": "FZ150",
    "year": 2023,
    "licensePlate": "XYZ789",
    "color": "Azul"
  }
}
```

#### Campos Requeridos
- `userId` - ID del usuario a asociar como repartidor
- `phone` - Teléfono de contacto

#### Campos Opcionales
- `licenseNumber` - Número de licencia de conducir
- `vehicle` - Información del vehículo (objeto completo)
  - `type` - Tipo de vehículo (MOTORCYCLE, CAR, BICYCLE, SCOOTER)
  - `brand` - Marca
  - `model` - Modelo
  - `year` - Año
  - `licensePlate` - Placa
  - `color` - Color

#### Response Success (201 Created)
```json
{
  "message": "Repartidor creado exitosamente",
  "rider": {
    "id": 2,
    "userId": 10,
    "phone": "987654321",
    "licenseNumber": "LIC789456",
    "status": "IDLE",
    "isActive": true,
    "rating": 5.0,
    "totalDeliveries": 0,
    "user": {
      "id": 10,
      "name": "Carlos",
      "email": "carlos@ejemplo.com"
    },
    "vehicle": {
      "id": 2,
      "type": "MOTORCYCLE",
      "brand": "Yamaha",
      "model": "FZ150",
      "year": 2023,
      "licensePlate": "XYZ789",
      "color": "Azul"
    }
  }
}
```

#### Response Error (403 Forbidden)
```json
{
  "error": "No tienes permisos para crear repartidores"
}
```

#### Response Error (400 Bad Request)
```json
{
  "error": "userId y phone son requeridos"
}
```

---

### 3. Obtener Repartidor por ID
**GET** `/api/riders/[id]`

Obtiene los detalles completos de un repartidor específico.

#### URL Parameters
- `id` - ID del repartidor (number)

#### Response Success (200 OK)
```json
{
  "rider": {
    "id": 1,
    "userId": 10,
    "phone": "123456789",
    "licenseNumber": "LIC123456",
    "status": "IDLE",
    "isActive": true,
    "rating": 4.5,
    "totalDeliveries": 150,
    "currentLat": -12.0464,
    "currentLng": -77.0428,
    "lastLocationUpdate": "2024-01-01T12:00:00.000Z",
    "user": {
      "id": 10,
      "name": "Carlos",
      "email": "carlos@ejemplo.com",
      "username": "carlos123",
      "avatar": null
    },
    "vehicle": {
      "id": 1,
      "type": "MOTORCYCLE",
      "brand": "Honda",
      "model": "XR150",
      "year": 2022,
      "licensePlate": "ABC123",
      "color": "Rojo"
    },
    "orders": [
      {
        "id": 1,
        "status": "completed",
        "totalAmount": 15.50,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### Response Error (404 Not Found)
```json
{
  "error": "Repartidor no encontrado"
}
```

---

### 4. Actualizar Repartidor
**PATCH** `/api/riders/[id]`

Actualiza la información de un repartidor. Soporta múltiples tipos de actualizaciones.

#### URL Parameters
- `id` - ID del repartidor (number)

#### Actualizar Estado
```json
{
  "status": "IDLE"
}
```

#### Actualizar Estado Activo/Inactivo
```json
{
  "isActive": true
}
```

#### Actualizar Calificación
```json
{
  "rating": 4.8
}
```

#### Actualizar Vehículo
```json
{
  "vehicle": {
    "type": "CAR",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2023,
    "licensePlate": "NEW123",
    "color": "Blanco"
  }
}
```

#### Response Success (200 OK)
```json
{
  "message": "Estado actualizado",
  "rider": {
    "id": 1,
    "status": "IDLE",
    "isActive": true,
    "rating": 4.8,
    "updatedAt": "2024-01-01T13:00:00.000Z"
  }
}
```

#### Response Error (400 Bad Request)
```json
{
  "error": "No hay campos para actualizar"
}
```

---

### 5. Eliminar Repartidor
**DELETE** `/api/riders/[id]`

Elimina un repartidor del sistema.

**🔒 Permisos:** Solo usuarios con rol "admin" pueden eliminar repartidores.

#### URL Parameters
- `id` - ID del repartidor (number)

#### Response Success (200 OK)
```json
{
  "message": "Repartidor eliminado exitosamente"
}
```

#### Response Error (403 Forbidden)
```json
{
  "error": "No autorizado"
}
```

---

### 6. Obtener Repartidores Disponibles
**GET** `/api/riders/available`

Obtiene todos los repartidores que están disponibles para tomar órdenes.

#### Criterios de Disponibilidad
- `status` = "IDLE"
- `isActive` = true

#### Response Success (200 OK)
```json
{
  "riders": [
    {
      "id": 1,
      "phone": "123456789",
      "status": "IDLE",
      "isActive": true,
      "rating": 4.5,
      "currentLat": -12.0464,
      "currentLng": -77.0428,
      "lastLocationUpdate": "2024-01-01T12:00:00.000Z",
      "user": {
        "id": 10,
        "name": "Carlos",
        "email": "carlos@ejemplo.com"
      },
      "vehicle": {
        "type": "MOTORCYCLE",
        "brand": "Honda",
        "model": "XR150"
      }
    }
  ],
  "count": 5
}
```

---

### 7. Actualizar Ubicación de Repartidor
**POST** `/api/riders/location`

Actualiza la ubicación en tiempo real del repartidor autenticado.

**👤 Permisos:** El usuario autenticado debe ser un repartidor.

#### Request Body
```json
{
  "lat": -12.0464,
  "lng": -77.0428,
  "speed": 35.5,
  "heading": 180.0,
  "accuracy": 10.5,
  "battery": 85,
  "source": "gps"
}
```

#### Campos Requeridos
- `lat` - Latitud (number)
- `lng` - Longitud (number)

#### Campos Opcionales
- `speed` - Velocidad en km/h
- `heading` - Dirección en grados (0-360)
- `accuracy` - Precisión en metros
- `battery` - Nivel de batería (0-100)
- `source` - Origen de la ubicación (gps, network, manual)

#### Response Success (200 OK)
```json
{
  "message": "Ubicación actualizada",
  "rider": {
    "id": 1,
    "currentLat": -12.0464,
    "currentLng": -77.0428,
    "lastLocationUpdate": "2024-01-01T12:30:00.000Z"
  }
}
```

#### Response Error (403 Forbidden)
```json
{
  "error": "Usuario no es un repartidor"
}
```

#### Response Error (400 Bad Request)
```json
{
  "error": "lat y lng son requeridos"
}
```

---

### 8. Obtener Historial de Ubicación
**GET** `/api/riders/location?riderId=X`

Obtiene el historial de ubicaciones de un repartidor.

#### Query Parameters
| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `riderId` | number | Sí | - | ID del repartidor |
| `from` | date | No | - | Fecha desde (ISO 8601) |
| `to` | date | No | - | Fecha hasta (ISO 8601) |
| `limit` | number | No | 100 | Máximo de registros |

#### Response Success (200 OK)
```json
{
  "history": [
    {
      "id": 1,
      "riderId": 1,
      "lat": -12.0464,
      "lng": -77.0428,
      "speed": 35.5,
      "heading": 180.0,
      "accuracy": 10.5,
      "battery": 85,
      "source": "gps",
      "timestamp": "2024-01-01T12:00:00.000Z"
    },
    {
      "id": 2,
      "riderId": 1,
      "lat": -12.0465,
      "lng": -77.0429,
      "speed": 40.0,
      "heading": 185.0,
      "accuracy": 8.0,
      "battery": 84,
      "source": "gps",
      "timestamp": "2024-01-01T12:05:00.000Z"
    }
  ]
}
```

#### Response Error (400 Bad Request)
```json
{
  "error": "riderId es requerido"
}
```

---

## 📝 Ejemplos de Uso

### Listar Repartidores Activos
```bash
curl -X GET "http://localhost:3000/api/riders?isActive=true&page=1&limit=10" \
  -H "Cookie: next-auth.session-token=..."
```

### Crear Repartidor (Admin)
```bash
curl -X POST http://localhost:3000/api/riders \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "userId": 15,
    "phone": "999888777",
    "licenseNumber": "LIC001122",
    "vehicle": {
      "type": "MOTORCYCLE",
      "brand": "Suzuki",
      "model": "GN125",
      "year": 2021,
      "licensePlate": "MNO456",
      "color": "Negro"
    }
  }'
```

### Obtener Repartidores Disponibles
```bash
curl -X GET http://localhost:3000/api/riders/available \
  -H "Cookie: next-auth.session-token=..."
```

### Actualizar Ubicación (Repartidor)
```bash
curl -X POST http://localhost:3000/api/riders/location \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "lat": -12.0464,
    "lng": -77.0428,
    "speed": 35.5,
    "heading": 180.0,
    "accuracy": 10.5,
    "battery": 85,
    "source": "gps"
  }'
```

### Obtener Historial de Ubicación
```bash
curl -X GET "http://localhost:3000/api/riders/location?riderId=1&limit=50" \
  -H "Cookie: next-auth.session-token=..."
```

### Cambiar Estado de Repartidor
```bash
curl -X PATCH http://localhost:3000/api/riders/1 \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "status": "IDLE"
  }'
```

### Activar/Desactivar Repartidor
```bash
curl -X PATCH http://localhost:3000/api/riders/1 \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "isActive": false
  }'
```

---

## 🔄 Flujo de Estados de Repartidor

```
OFFLINE → IDLE ⇄ ON_DELIVERY → IDLE
         (disponible)  (entregando)
```

### Descripción de Estados
1. **OFFLINE** - Repartidor no disponible, fuera de línea
2. **IDLE** - Repartidor disponible para recibir órdenes
3. **ON_DELIVERY** - Repartidor tiene una entrega activa

---

## 🚗 Tipos de Vehículo Soportados

- `MOTORCYCLE` - Motocicleta
- `CAR` - Automóvil
- `BICYCLE` - Bicicleta
- `SCOOTER` - Scooter eléctrico

---

## 🔗 Recursos Relacionados
- [Módulo de Órdenes](API_ORDERS_ENDPOINTS.md)
- [RiderService](../src/lib/rider-service.ts)
