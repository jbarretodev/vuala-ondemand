# Sistema de Roles - Vualá OnDemand

## 📋 Implementación Completada

Se ha implementado un sistema completo de roles con la relación User → Role y la creación automática de Usuario al crear un Cliente.

## 🗄️ Modelo de Datos

### Modelo Role

```prisma
model Role {
  id          Int      @id @default(autoincrement())
  name        String   @unique @db.VarChar(50)
  description String?  @db.VarChar(255)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  users User[]

  @@map("roles")
}
```

### Modelo User (Actualizado)

```prisma
model User {
  id          Int      @id @default(autoincrement())
  username    String   @unique @db.VarChar(100)
  name        String   @db.VarChar(255)
  email       String   @unique @db.VarChar(255)
  password    String   @db.VarChar(255)
  roleId      Int      @map("role_id")  // ← Relación con Role
  avatar      String?  @db.VarChar(500)
  providerId  String?  @map("provider_id") @db.VarChar(255)
  providerName String? @map("provider_name") @db.VarChar(50)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  role      Role       @relation(fields: [roleId], references: [id])
  customers Customer[]
}
```

## 🎭 Roles Disponibles

### 1. Admin (ID: 1)
- **Descripción**: Administrador del sistema
- **Permisos**: Acceso completo al sistema

### 2. Customer (ID: 2)
- **Descripción**: Cliente del sistema
- **Permisos**: Gestión de sus propias órdenes

### 3. Rider (ID: 3)
- **Descripción**: Repartidor
- **Permisos**: Gestión de entregas asignadas

## 📝 Formulario de Crear Cliente

El formulario ahora incluye dos secciones:

### Sección 1: Información Personal
- ✅ Nombre (requerido)
- ✅ Apellido (requerido)
- ✅ DNI / Documento (requerido, mínimo 5 caracteres)
- ✅ Fecha de Nacimiento (opcional)
- ✅ Dirección (opcional)

### Sección 2: Información de Usuario
- ✅ Nombre de Usuario (requerido, único)
- ✅ Email (requerido, único)
- ✅ Rol (requerido, selector con Admin/Customer/Rider)
- ✅ Contraseña (requerido, mínimo 6 caracteres)
- ✅ Confirmar Contraseña (requerido, debe coincidir)

## 🔄 Flujo de Creación

```
Usuario completa formulario
  ↓
1. Validación de campos requeridos
2. Validación de contraseñas coinciden
3. Validación de longitud de DNI (mín 5)
4. Validación de longitud de contraseña (mín 6)
  ↓
POST /api/customers
  ↓
Backend:
1. Verifica username y email únicos
2. Verifica DNI único
3. Hash de contraseña con bcrypt
4. Transacción:
   a. Crea User con roleId
   b. Crea Customer asociado
  ↓
✅ Usuario + Cliente creados exitosamente
```

## 🔐 Validaciones Implementadas

### Frontend
- ✅ Todos los campos requeridos
- ✅ Contraseñas deben coincidir
- ✅ DNI mínimo 5 caracteres
- ✅ Password mínimo 6 caracteres
- ✅ Email formato válido (HTML5)

### Backend
- ✅ Username único
- ✅ Email único
- ✅ DNI único
- ✅ Password mínimo 6 caracteres
- ✅ DNI mínimo 5 caracteres
- ✅ Todos los campos requeridos presentes

## 📊 Estructura de la Base de Datos

```
Role (1) ←─── (N) User (1) ←─── (N) Customer (1) ←─── (N) Order
```

**Relaciones:**
- Un **Role** puede tener múltiples **Users**
- Un **User** pertenece a un **Role**
- Un **User** puede tener múltiples **Customers**
- Un **Customer** pertenece a un **User**
- Un **Customer** puede tener múltiples **Orders**

## 🗄️ Migración Aplicada

**Migración**: `20251004230115_add_role_model`

```sql
-- CreateTable: roles
CREATE TABLE "public"."roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "public"."roles"("name");

-- AlterTable: users
ALTER TABLE "public"."users" DROP COLUMN "role";
ALTER TABLE "public"."users" ADD COLUMN "role_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "public"."users"("role_id");

-- AddForeignKey
ALTER TABLE "public"."users" 
ADD CONSTRAINT "users_role_id_fkey" 
FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;
```

## 📁 Archivos Modificados

### Schema y Migraciones
1. **`prisma/schema.prisma`**
   - Agregado modelo `Role`
   - Cambiado `User.role` (String) → `User.roleId` (Int)
   - Agregada relación `User.role` → `Role`

2. **`prisma/migrations/20251004230115_add_role_model/`**
   - Nueva migración para roles

3. **`prisma/seed.ts`**
   - Creación de 3 roles (admin, customer, rider)
   - Usuarios actualizados con `roleId`

### Backend
4. **`src/app/api/customers/route.ts`**
   - POST actualizado para crear User + Customer
   - Validaciones de username, email, password
   - Verificación de unicidad
   - Transacción atómica
   - Hash de contraseña con bcrypt

### Frontend
5. **`src/app/(dashboard)/dashboard/clientes/nuevo/page.tsx`**
   - Formulario dividido en dos secciones
   - Campos de usuario agregados
   - Selector de rol
   - Validación de contraseñas coinciden
   - Confirmación de contraseña

## 🧪 Datos de Prueba

### Roles Creados
```javascript
{
  admin: { id: 1, name: "admin" },
  customer: { id: 2, name: "customer" },
  rider: { id: 3, name: "rider" }
}
```

### Usuarios Existentes
```javascript
{
  admin: {
    username: "admin",
    email: "admin@vuala.com",
    password: "password",
    roleId: 1 // admin
  },
  user: {
    username: "user",
    email: "user@vuala.com",
    password: "password",
    roleId: 2 // customer
  }
}
```

## 🎯 Ejemplo de Uso

### Crear Cliente con Usuario

**Formulario:**
```
Información Personal:
- Nombre: Juan
- Apellido: Pérez García
- DNI: 12345678A
- Fecha Nacimiento: 15/03/1985
- Dirección: Calle Mayor 123, Madrid

Información de Usuario:
- Username: juanperez
- Email: juan.perez@example.com
- Rol: Customer
- Contraseña: password123
- Confirmar: password123
```

**Resultado:**
```json
{
  "message": "Cliente y usuario creados exitosamente",
  "customer": {
    "id": 4,
    "name": "Juan",
    "lastname": "Pérez García",
    "dni": "12345678A",
    "dob": "1985-03-15",
    "address": "Calle Mayor 123, Madrid",
    "userId": 3,
    "user": {
      "id": 3,
      "username": "juanperez",
      "email": "juan.perez@example.com",
      "role": {
        "id": 2,
        "name": "customer"
      }
    }
  },
  "user": {
    "id": 3,
    "username": "juanperez",
    "email": "juan.perez@example.com"
  }
}
```

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (12 rounds)
- ✅ Validación de unicidad (username, email, DNI)
- ✅ Transacciones atómicas (todo o nada)
- ✅ Validación en cliente y servidor
- ✅ Autenticación requerida (NextAuth)
- ✅ Confirmación de contraseña

## 📝 Notas Importantes

1. **Roles**: Son fijos y se crean en el seed (admin, customer, rider)
2. **Transacción**: User y Customer se crean juntos o ninguno
3. **Contraseña**: Mínimo 6 caracteres, hasheada con bcrypt
4. **Username**: Debe ser único en todo el sistema
5. **Email**: Debe ser único en todo el sistema
6. **DNI**: Debe ser único en todo el sistema
7. **Rol por defecto**: Customer (ID: 2)

## 🚀 Próximos Pasos Sugeridos

1. **Permisos**: Implementar sistema de permisos por rol
2. **Middleware**: Verificar roles en rutas protegidas
3. **Dashboard**: Mostrar información según rol del usuario
4. **Riders**: Crear módulo específico para repartidores
5. **Auditoría**: Log de cambios de roles

---

**Fecha de Implementación**: 4 de Octubre, 2025  
**Estado**: ✅ Completado y Funcional  
**Relación**: Role (1) → (N) User (1) → (N) Customer (1) → (N) Order
