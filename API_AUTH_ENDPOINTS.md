# 🔐 API de Autenticación

[← Volver al índice](API_ENDPOINTS_INDEX.md)

## Descripción General

Endpoints para autenticación de usuarios, incluyendo registro y login mediante NextAuth.

---

## 📋 Endpoints Disponibles

### 1. Login (NextAuth)
**POST/GET** `/api/auth/[...nextauth]`

Maneja la autenticación mediante NextAuth con múltiples proveedores.

#### Proveedores Soportados
- **Credentials** - Email y contraseña
- **Google OAuth** - Autenticación con Google

#### Request Body (Credentials)
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### Validaciones
- Email y contraseña son requeridos
- El usuario debe existir en la base de datos
- La contraseña debe coincidir con el hash almacenado

#### Response Success (200 OK)
```json
{
  "user": {
    "id": "1",
    "email": "usuario@ejemplo.com",
    "name": "Juan",
    "role": "customer"
  },
  "session": {
    "expires": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Response Error (401 Unauthorized)
```json
{
  "error": "Invalid credentials"
}
```

#### Notas Importantes
- Utiliza bcrypt para comparar contraseñas
- La sesión se maneja mediante JWT
- El rol del usuario se incluye en el token
- Redirige a `/login` en caso de error
- La contraseña nunca se devuelve en la respuesta

---

### 2. Registro de Usuario
**POST** `/api/auth/register`

Crea una nueva cuenta de usuario y su cliente asociado automáticamente.

#### Request Body
```json
{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "contraseña123"
}
```

#### Validaciones
- Todos los campos son requeridos
- Email debe tener formato válido
- Contraseña mínimo 6 caracteres
- Email no puede estar duplicado
- El nombre se divide automáticamente en nombre y apellido

#### Proceso de Registro
1. Valida los datos de entrada
2. Verifica que el email no exista
3. Genera un username único basado en el email
4. Hashea la contraseña con bcrypt (salt: 12)
5. Crea el usuario con roleId=2 (customer)
6. Genera un DNI único para el cliente
7. Crea el registro de cliente asociado
8. Todo se ejecuta en una transacción atómica

#### Response Success (201 Created)
```json
{
  "message": "Cuenta creada exitosamente.",
  "user": {
    "id": 1,
    "username": "juan123",
    "name": "Juan",
    "email": "juan@ejemplo.com",
    "roleId": 2,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "customer": {
    "id": 1,
    "name": "Juan",
    "lastname": "Pérez",
    "dni": "DNI-1-1704067200000"
  }
}
```

#### Response Error (400 Bad Request)
```json
{
  "message": "Todos los campos son requeridos."
}
```

```json
{
  "message": "La contraseña debe tener al menos 6 caracteres."
}
```

```json
{
  "message": "Correo electrónico inválido."
}
```

#### Response Error (409 Conflict)
```json
{
  "message": "Ya existe una cuenta con este correo electrónico."
}
```

#### Response Error (500 Internal Server Error)
```json
{
  "message": "Error interno del servidor."
}
```

#### Funciones Auxiliares

**splitFullName()**
- Divide el nombre completo en nombre y apellido
- Si solo hay 1 palabra: usa la misma para ambos
- Si hay 2 palabras: primera es nombre, segunda es apellido
- Si hay 3+ palabras: primera es nombre, resto es apellido

**generateUsername()**
- Extrae el prefijo del email
- Elimina caracteres especiales
- Verifica unicidad en la base de datos
- Añade contador si el username ya existe

**generateUniqueDNI()**
- Formato: `DNI-{userId}-{timestamp}`
- Verifica unicidad
- Añade caracteres aleatorios si es necesario

---

## 🔒 Configuración de Seguridad

### NextAuth Configuration
```typescript
{
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login"
  }
}
```

### Variables de Entorno Necesarias
```env
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 📝 Ejemplos de Uso

### Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "email": "maria@ejemplo.com",
    "password": "password123"
  }'
```

### Login con Credentials
```bash
curl -X POST http://localhost:3000/api/auth/signin/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@ejemplo.com",
    "password": "password123"
  }'
```

---

## 🔗 Recursos Relacionados
- [NextAuth Documentation](https://next-auth.js.org/)
- [Módulo de Clientes](API_CUSTOMERS_ENDPOINTS.md)
- [Módulo de Perfil](API_PROFILE_ENDPOINTS.md)
