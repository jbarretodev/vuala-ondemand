# 📚 Documentación de API - VUALA OnDemand

## Índice de Endpoints

Esta documentación está organizada por módulos para facilitar la navegación.

### 📂 Módulos Disponibles

1. **[Autenticación](API_AUTH_ENDPOINTS.md)** - Registro, login y gestión de sesiones
2. **[Clientes](API_CUSTOMERS_ENDPOINTS.md)** - CRUD completo de clientes
3. **[Órdenes](API_ORDERS_ENDPOINTS.md)** - Gestión de pedidos y asignaciones
4. **[Repartidores](API_RIDERS_ENDPOINTS.md)** - Gestión de riders y ubicaciones
5. **[Perfil](API_PROFILE_ENDPOINTS.md)** - Gestión de perfil de usuario
6. **[Usuarios](API_USERS_ENDPOINTS.md)** - Administración de usuarios

---

## 📊 Resumen Rápido

| Módulo | Endpoints | Descripción |
|--------|-----------|-------------|
| Autenticación | 2 | Login y registro de usuarios |
| Clientes | 5 | Gestión completa de clientes |
| Órdenes | 3 | Creación y asignación de órdenes |
| Repartidores | 7 | Gestión de riders y ubicaciones |
| Perfil | 2 | Actualización de perfil y contraseña |
| Usuarios | 1 | Listado de usuarios (admin) |

**Total: 20 endpoints**

---

## 🔐 Autenticación

Todos los endpoints (excepto `/api/auth/register` y `/api/auth/[...nextauth]`) requieren autenticación mediante NextAuth.

### Headers Requeridos
```
Content-Type: application/json
```

### Sesión
La autenticación se maneja automáticamente mediante NextAuth con cookies de sesión.

---

## 📝 Convenciones

- **URL Base**: `http://localhost:3000` (desarrollo)
- **Formato de respuesta**: JSON
- **Códigos de estado comunes**:
  - `200` - OK
  - `201` - Created
  - `400` - Bad Request
  - `401` - Unauthorized
  - `403` - Forbidden
  - `404` - Not Found
  - `409` - Conflict
  - `500` - Internal Server Error

---

## 🚀 Inicio Rápido

### 1. Registrar un usuario
```bash
POST /api/auth/register
```

### 2. Iniciar sesión
```bash
POST /api/auth/[...nextauth]/callback/credentials
```

### 3. Crear una orden
```bash
POST /api/orders
```

---

## 📖 Documentación Detallada

Consulta cada módulo para ver la documentación completa de cada endpoint.
