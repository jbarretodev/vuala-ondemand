# 👥 API de Clientes

[← Volver al índice](API_ENDPOINTS_INDEX.md)

## Descripción General

Endpoints para la gestión completa de clientes (CRUD), incluyendo búsqueda, estadísticas y relación con usuarios.

**⚠️ Autenticación Requerida:** Todos los endpoints requieren sesión activa.

---

## 📋 Endpoints Disponibles

### 1. Listar Clientes
**GET** `/api/customers`

Obtiene todos los clientes con paginación y filtros opcionales.

#### Query Parameters
| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `page` | number | No | 1 | Número de página |
| `limit` | number | No | 10 | Clientes por página |
| `userId` | number | No | - | Filtrar por ID de usuario |
| `search` | string | No | - | Búsqueda por nombre, apellido o DNI |

#### Response Success (200 OK)
```json
{
  "customers": [
    {
      "id": 1,
      "name": "Juan",
      "lastname": "Pérez",
      "dni": "12345678",
      "address": "Calle Principal 123",
      "dob": "1990-01-01T00:00:00.000Z",
      "userId": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": 5,
        "username": "juan123",
        "email": "juan@ejemplo.com",
        "role": {
          "id": 2,
          "name": "customer"
        }
      }
    }
  ],
  "total": 50,
  "pages": 5,
  "currentPage": 1
}
```

#### Con Búsqueda
```json
{
  "customers": [
    {
      "id": 1,
      "name": "Juan",
      "lastname": "Pérez",
      "dni": "12345678"
    }
  ]
}
```

#### Response Error (401 Unauthorized)
```json
{
  "error": "No autorizado"
}
```

---

### 2. Crear Cliente
**POST** `/api/customers`

Crea un nuevo cliente Y su usuario asociado en una transacción atómica.

#### Request Body
```json
{
  "name": "María",
  "lastname": "García",
  "address": "Av. Libertador 456",
  "dni": "87654321",
  "dob": "1995-05-15",
  "username": "maria123",
  "email": "maria@ejemplo.com",
  "password": "password123",
  "roleId": 2
}
```

#### Campos Requeridos
- `name` - Nombre del cliente
- `lastname` - Apellido del cliente
- `dni` - Documento de identidad (mínimo 5 caracteres)
- `username` - Nombre de usuario único
- `email` - Email único
- `password` - Contraseña (mínimo 6 caracteres)

#### Campos Opcionales
- `address` - Dirección
- `dob` - Fecha de nacimiento
- `roleId` - ID del rol (default: 2 - customer)

#### Validaciones
- DNI no puede estar duplicado
- Username no puede estar duplicado
- Email no puede estar duplicado
- Contraseña mínimo 6 caracteres
- DNI mínimo 5 caracteres

#### Response Success (201 Created)
```json
{
  "message": "Cliente y usuario creados exitosamente",
  "customer": {
    "id": 2,
    "name": "María",
    "lastname": "García",
    "address": "Av. Libertador 456",
    "dni": "87654321",
    "dob": "1995-05-15T00:00:00.000Z",
    "userId": 6,
    "user": {
      "id": 6,
      "username": "maria123",
      "name": "María",
      "email": "maria@ejemplo.com",
      "role": {
        "id": 2,
        "name": "customer"
      }
    }
  },
  "user": {
    "id": 6,
    "username": "maria123",
    "email": "maria@ejemplo.com"
  }
}
```

#### Response Error (400 Bad Request)
```json
{
  "error": "Nombre, apellido y DNI son requeridos"
}
```

```json
{
  "error": "La contraseña debe tener al menos 6 caracteres"
}
```

#### Response Error (409 Conflict)
```json
{
  "error": "El username o email ya está en uso"
}
```

```json
{
  "error": "Ya existe un cliente con este DNI"
}
```

---

### 3. Obtener Cliente por ID
**GET** `/api/customers/[id]`

Obtiene los detalles completos de un cliente incluyendo sus órdenes.

#### URL Parameters
- `id` - ID del cliente (number)

#### Response Success (200 OK)
```json
{
  "customer": {
    "id": 1,
    "name": "Juan",
    "lastname": "Pérez",
    "dni": "12345678",
    "address": "Calle Principal 123",
    "dob": "1990-01-01T00:00:00.000Z",
    "userId": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": 5,
      "username": "juan123",
      "email": "juan@ejemplo.com"
    },
    "orders": [
      {
        "id": 1,
        "pickupAddress": "Calle A",
        "deliveryAddress": "Calle B",
        "status": "completed",
        "totalAmount": 15.50,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### Response Error (400 Bad Request)
```json
{
  "error": "ID de cliente inválido"
}
```

#### Response Error (404 Not Found)
```json
{
  "error": "Cliente no encontrado"
}
```

---

### 4. Actualizar Cliente
**PUT** `/api/customers/[id]`

Actualiza la información de un cliente existente.

#### URL Parameters
- `id` - ID del cliente (number)

#### Request Body
```json
{
  "name": "Juan Carlos",
  "lastname": "Pérez López",
  "address": "Nueva Calle 789",
  "dob": "1990-01-01"
}
```

#### Campos Actualizables
- `name` - Nombre
- `lastname` - Apellido
- `address` - Dirección
- `dob` - Fecha de nacimiento

**Nota:** No se puede actualizar el DNI ni el userId.

#### Response Success (200 OK)
```json
{
  "message": "Cliente actualizado exitosamente",
  "customer": {
    "id": 1,
    "name": "Juan Carlos",
    "lastname": "Pérez López",
    "address": "Nueva Calle 789",
    "dob": "1990-01-01T00:00:00.000Z",
    "dni": "12345678",
    "userId": 5,
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

#### Response Error (404 Not Found)
```json
{
  "error": "Cliente no encontrado"
}
```

---

### 5. Eliminar Cliente
**DELETE** `/api/customers/[id]`

Elimina un cliente Y su usuario asociado. Solo permite eliminar si no tiene órdenes.

#### URL Parameters
- `id` - ID del cliente (number)

#### Validaciones
- El cliente no debe tener órdenes asociadas
- El cliente debe existir

#### Response Success (200 OK)
```json
{
  "message": "Cliente y usuario eliminados exitosamente"
}
```

#### Response Error (400 Bad Request)
```json
{
  "error": "No se puede eliminar el cliente porque tiene 3 orden(es) asociada(s)"
}
```

#### Response Error (404 Not Found)
```json
{
  "error": "Cliente no encontrado"
}
```

---

### 6. Obtener Estadísticas de Cliente
**GET** `/api/customers/[id]/stats`

Obtiene estadísticas de un cliente específico.

#### URL Parameters
- `id` - ID del cliente (number)

#### Response Success (200 OK)
```json
{
  "stats": {
    "totalOrders": 15,
    "completedOrders": 12,
    "cancelledOrders": 2,
    "pendingOrders": 1,
    "totalSpent": 450.75,
    "averageOrderValue": 30.05,
    "lastOrderDate": "2024-01-15T00:00:00.000Z"
  }
}
```

#### Response Error (404 Not Found)
```json
{
  "error": "Cliente no encontrado"
}
```

---

## 📝 Ejemplos de Uso

### Listar Clientes con Paginación
```bash
curl -X GET "http://localhost:3000/api/customers?page=1&limit=10" \
  -H "Cookie: next-auth.session-token=..."
```

### Buscar Cliente
```bash
curl -X GET "http://localhost:3000/api/customers?search=Juan" \
  -H "Cookie: next-auth.session-token=..."
```

### Crear Cliente
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "name": "Pedro",
    "lastname": "Martínez",
    "dni": "11223344",
    "username": "pedro123",
    "email": "pedro@ejemplo.com",
    "password": "password123"
  }'
```

### Actualizar Cliente
```bash
curl -X PUT http://localhost:3000/api/customers/1 \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "name": "Pedro Antonio",
    "address": "Calle Nueva 999"
  }'
```

### Eliminar Cliente
```bash
curl -X DELETE http://localhost:3000/api/customers/1 \
  -H "Cookie: next-auth.session-token=..."
```

---

## 🔗 Recursos Relacionados
- [Módulo de Autenticación](API_AUTH_ENDPOINTS.md)
- [Módulo de Órdenes](API_ORDERS_ENDPOINTS.md)
- [CustomerService](../src/lib/customer-service.ts)
