# 👤 API de Perfil de Usuario

[← Volver al índice](API_ENDPOINTS_INDEX.md)

## Descripción General

Endpoints para la gestión del perfil del usuario autenticado, incluyendo actualización de información personal y cambio de contraseña.

**⚠️ Autenticación Requerida:** Todos los endpoints requieren sesión activa.

---

## 📋 Endpoints Disponibles

### 1. Obtener Perfil del Usuario
**GET** `/api/profile`

Obtiene la información del perfil del usuario autenticado actualmente.

#### Response Success (200 OK)
```json
{
  "user": {
    "id": 5,
    "name": "Juan",
    "email": "juan@ejemplo.com",
    "username": "juan123",
    "avatar": "https://ejemplo.com/avatars/juan.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Campos en la Respuesta
- `id` - ID único del usuario
- `name` - Nombre del usuario
- `email` - Correo electrónico
- `username` - Nombre de usuario único
- `avatar` - URL del avatar (puede ser null)
- `createdAt` - Fecha de creación de la cuenta
- `updatedAt` - Fecha de última actualización

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

**Nota:** Este endpoint obtiene automáticamente el usuario de la sesión, no requiere pasar el ID.

---

### 2. Actualizar Perfil del Usuario
**PATCH** `/api/profile`

Actualiza la información del perfil del usuario autenticado.

#### Request Body
```json
{
  "name": "Juan Carlos",
  "username": "juancarlos123",
  "avatar": "https://ejemplo.com/avatars/nuevo-avatar.jpg"
}
```

#### Campos Actualizables
- `name` - Nombre del usuario (opcional)
- `username` - Nombre de usuario único (opcional)
- `avatar` - URL del avatar (opcional)

**Nota:** Solo se actualizan los campos que se envían en el request. Los campos omitidos mantienen su valor actual.

#### Validaciones
- Si se cambia el `username`, debe ser único en el sistema
- No se puede actualizar el email mediante este endpoint
- El usuario debe estar autenticado

#### Response Success (200 OK)
```json
{
  "success": true,
  "message": "Perfil actualizado correctamente",
  "user": {
    "id": 5,
    "name": "Juan Carlos",
    "email": "juan@ejemplo.com",
    "username": "juancarlos123",
    "avatar": "https://ejemplo.com/avatars/nuevo-avatar.jpg",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### Response Error (400 Bad Request)
```json
{
  "error": "El nombre de usuario ya está en uso"
}
```

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

### 3. Cambiar Contraseña
**PATCH** `/api/profile/password`

Permite al usuario cambiar su contraseña actual por una nueva.

#### Request Body
```json
{
  "currentPassword": "contraseñaActual123",
  "newPassword": "nuevaContraseña456",
  "confirmPassword": "nuevaContraseña456"
}
```

#### Campos Requeridos
- `currentPassword` - Contraseña actual del usuario
- `newPassword` - Nueva contraseña deseada
- `confirmPassword` - Confirmación de la nueva contraseña

#### Validaciones
- Todos los campos son obligatorios
- `newPassword` debe tener mínimo 6 caracteres
- `newPassword` y `confirmPassword` deben coincidir
- `currentPassword` debe ser correcta
- El usuario debe tener una contraseña (no aplica para usuarios OAuth)

#### Proceso de Cambio de Contraseña
1. Verifica autenticación del usuario
2. Valida que todos los campos estén presentes
3. Verifica que las contraseñas nuevas coincidan
4. Obtiene el usuario de la base de datos con su password hash
5. Compara la contraseña actual con bcrypt
6. Hashea la nueva contraseña con bcrypt (salt: 10)
7. Actualiza el password en la base de datos

#### Response Success (200 OK)
```json
{
  "success": true,
  "message": "Contraseña actualizada correctamente"
}
```

#### Response Error (400 Bad Request)
```json
{
  "error": "Todos los campos son requeridos"
}
```

```json
{
  "error": "Las contraseñas no coinciden"
}
```

```json
{
  "error": "La contraseña debe tener al menos 6 caracteres"
}
```

```json
{
  "error": "La contraseña actual es incorrecta"
}
```

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

## 📝 Ejemplos de Uso

### Obtener Perfil Actual
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Cookie: next-auth.session-token=..."
```

### Actualizar Nombre
```bash
curl -X PATCH http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "name": "Juan Carlos Pérez"
  }'
```

### Actualizar Username y Avatar
```bash
curl -X PATCH http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "username": "juancarlos2024",
    "avatar": "https://ejemplo.com/avatar.jpg"
  }'
```

### Cambiar Contraseña
```bash
curl -X PATCH http://localhost:3000/api/profile/password \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "currentPassword": "miPasswordActual",
    "newPassword": "miNuevoPassword123",
    "confirmPassword": "miNuevoPassword123"
  }'
```

---

## 🔒 Seguridad

### Protección de Contraseñas
- Las contraseñas se hashean con **bcrypt**
- Salt rounds: 10 para nuevas contraseñas, 12 para registro
- Las contraseñas nunca se devuelven en las respuestas
- La contraseña actual se valida antes de permitir el cambio

### Validación de Username
- El username debe ser único en el sistema
- Se verifica antes de actualizar
- No se permiten duplicados

### Sesión
- Todas las operaciones requieren sesión activa de NextAuth
- El usuario se identifica automáticamente por la sesión
- No es necesario pasar el userId en las peticiones

---

## 💡 Notas Importantes

### Actualización de Email
- El email **NO** se puede actualizar mediante estos endpoints
- Para cambiar el email, contactar al administrador del sistema

### Usuarios OAuth (Google)
- Los usuarios autenticados con Google pueden no tener contraseña local
- El endpoint de cambio de contraseña devolverá error 404 para estos usuarios

### Campos No Modificables
- `id` - ID del usuario (generado automáticamente)
- `email` - Correo electrónico (requiere verificación)
- `roleId` - Rol del usuario (solo admin puede cambiar)
- `createdAt` - Fecha de creación
- `password` - Solo mediante endpoint específico de cambio de contraseña

---

## 🔗 Recursos Relacionados
- [Módulo de Autenticación](API_AUTH_ENDPOINTS.md)
- [Módulo de Usuarios](API_USERS_ENDPOINTS.md)
