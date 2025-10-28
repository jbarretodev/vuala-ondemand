# 👥 API de Usuarios (Admin)

[← Volver al índice](API_ENDPOINTS_INDEX.md)

## Descripción General

Endpoints para la administración de usuarios del sistema. Acceso exclusivo para usuarios con rol de administrador.

**🔒 Permisos:** Solo usuarios con rol "admin" pueden acceder a estos endpoints.

**⚠️ Autenticación Requerida:** Todos los endpoints requieren sesión activa.

---

## 📋 Endpoints Disponibles

### 1. Listar Usuarios
**GET** `/api/users`

Obtiene un listado de todos los usuarios del sistema con paginación y filtros opcionales.

**🔒 Restricción:** Solo accesible para usuarios con rol "admin".

#### Query Parameters
| Parámetro | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `page` | number | No | 1 | Número de página |
| `limit` | number | No | 50 | Usuarios por página |
| `roleId` | number | No | - | Filtrar por ID de rol |

#### Roles Disponibles en el Sistema
| ID | Nombre | Descripción |
|----|--------|-------------|
| 1 | admin | Administrador del sistema |
| 2 | customer | Cliente del servicio |
| 3 | rider | Repartidor |
| 4 | dispatcher | Despachador |

#### Response Success (200 OK)
```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "name": "Administrador",
      "email": "admin@ejemplo.com",
      "roleId": 1,
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "role": {
        "id": 1,
        "name": "admin"
      }
    },
    {
      "id": 2,
      "username": "juan123",
      "name": "Juan",
      "email": "juan@ejemplo.com",
      "roleId": 2,
      "avatar": "https://ejemplo.com/avatars/juan.jpg",
      "createdAt": "2024-01-02T00:00:00.000Z",
      "role": {
        "id": 2,
        "name": "customer"
      }
    },
    {
      "id": 3,
      "username": "carlos_rider",
      "name": "Carlos",
      "email": "carlos@ejemplo.com",
      "roleId": 3,
      "avatar": null,
      "createdAt": "2024-01-03T00:00:00.000Z",
      "role": {
        "id": 3,
        "name": "rider"
      }
    }
  ],
  "total": 150,
  "pages": 3,
  "currentPage": 1
}
```

#### Campos en la Respuesta
- `id` - ID único del usuario
- `username` - Nombre de usuario único
- `name` - Nombre del usuario
- `email` - Correo electrónico
- `roleId` - ID del rol asignado
- `avatar` - URL del avatar (puede ser null)
- `createdAt` - Fecha de creación de la cuenta
- `role` - Objeto con información del rol
  - `id` - ID del rol
  - `name` - Nombre del rol

**Nota:** La contraseña nunca se incluye en las respuestas por seguridad.

#### Response Error (401 Unauthorized)
```json
{
  "error": "No autorizado"
}
```

#### Response Error (403 Forbidden)
```json
{
  "error": "No tienes permisos para listar usuarios"
}
```

---

## 📝 Ejemplos de Uso

### Listar Todos los Usuarios (Primera Página)
```bash
curl -X GET "http://localhost:3000/api/users" \
  -H "Cookie: next-auth.session-token=..."
```

### Listar Usuarios con Paginación
```bash
curl -X GET "http://localhost:3000/api/users?page=2&limit=20" \
  -H "Cookie: next-auth.session-token=..."
```

### Filtrar Solo Clientes (roleId=2)
```bash
curl -X GET "http://localhost:3000/api/users?roleId=2" \
  -H "Cookie: next-auth.session-token=..."
```

### Filtrar Solo Repartidores (roleId=3)
```bash
curl -X GET "http://localhost:3000/api/users?roleId=3&page=1&limit=100" \
  -H "Cookie: next-auth.session-token=..."
```

### Filtrar Solo Administradores (roleId=1)
```bash
curl -X GET "http://localhost:3000/api/users?roleId=1" \
  -H "Cookie: next-auth.session-token=..."
```

---

## 🔒 Seguridad y Permisos

### Control de Acceso
- **Verificación de sesión:** El usuario debe estar autenticado
- **Verificación de rol:** Solo usuarios con `role === "admin"` pueden acceder
- **Protección de datos:** Las contraseñas nunca se exponen en las respuestas

### Validación de Permisos
1. Verifica que existe una sesión activa
2. Comprueba que el rol del usuario sea "admin"
3. Si no cumple con los requisitos, devuelve 403 Forbidden

---

## 📊 Información sobre Paginación

### Configuración por Defecto
- **Página inicial:** 1
- **Límite por defecto:** 50 usuarios
- **Límite máximo recomendado:** 100 usuarios

### Cálculo de Páginas
```javascript
const skip = (page - 1) * limit
const totalPages = Math.ceil(total / limit)
```

### Respuesta de Paginación
```json
{
  "users": [...],
  "total": 150,        // Total de usuarios en el sistema
  "pages": 3,          // Total de páginas disponibles
  "currentPage": 1     // Página actual
}
```

---

## 💡 Casos de Uso Comunes

### 1. Obtener Lista de Clientes para Asignar Órdenes
```bash
GET /api/users?roleId=2&limit=100
```

### 2. Obtener Lista de Repartidores para Asignación
```bash
GET /api/users?roleId=3
```
**Nota:** Para repartidores, es mejor usar `/api/riders/available` que filtra por disponibilidad.

### 3. Auditoría de Usuarios por Rol
```bash
GET /api/users?roleId=1  # Administradores
GET /api/users?roleId=2  # Clientes
GET /api/users?roleId=3  # Repartidores
GET /api/users?roleId=4  # Despachadores
```

### 4. Listar Todos los Usuarios para Reportes
```bash
GET /api/users?limit=1000
```

---

## 🔗 Endpoints Relacionados

### Para Gestión de Clientes
Si necesitas información más detallada de clientes (con órdenes, estadísticas, etc.), usa:
- **GET** `/api/customers` - [Ver documentación](API_CUSTOMERS_ENDPOINTS.md)

### Para Gestión de Repartidores
Si necesitas información completa de repartidores (con vehículos, ubicación, etc.), usa:
- **GET** `/api/riders` - [Ver documentación](API_RIDERS_ENDPOINTS.md)

### Para Crear Usuarios
Para crear nuevos usuarios, dependiendo del rol:
- **Clientes:** `POST /api/auth/register` o `POST /api/customers`
- **Repartidores:** `POST /api/riders` (requiere un usuario existente)
- **Administradores:** Actualmente no hay endpoint público (usar base de datos)

---

## 📋 Esquema del Modelo Usuario

```typescript
interface User {
  id: number
  username: string
  name: string
  email: string
  password: string      // Hasheado con bcrypt, nunca se expone
  roleId: number
  avatar?: string | null
  createdAt: Date
  updatedAt: Date
  
  // Relaciones
  role: Role
  customers?: Customer[]
  riders?: Rider[]
}

interface Role {
  id: number
  name: string
  description?: string
}
```

---

## ⚠️ Notas Importantes

### Limitaciones Actuales
- No existe endpoint público para crear usuarios admin
- No se puede cambiar el rol de un usuario mediante API (requiere base de datos)
- No se puede eliminar usuarios mediante API
- La actualización de usuarios se hace mediante endpoints específicos:
  - `/api/profile` - Para el usuario autenticado
  - `/api/customers/[id]` - Para clientes
  - `/api/riders/[id]` - Para repartidores

### Datos Sensibles
- Las contraseñas están excluidas del SELECT en la consulta
- Los datos personales están protegidos según el rol del solicitante
- Solo administradores pueden ver la lista completa de usuarios

### Ordenamiento
Los usuarios se ordenan por fecha de creación descendente (más recientes primero).

---

## 🔗 Recursos Relacionados
- [Módulo de Autenticación](API_AUTH_ENDPOINTS.md)
- [Módulo de Clientes](API_CUSTOMERS_ENDPOINTS.md)
- [Módulo de Repartidores](API_RIDERS_ENDPOINTS.md)
- [Módulo de Perfil](API_PROFILE_ENDPOINTS.md)
