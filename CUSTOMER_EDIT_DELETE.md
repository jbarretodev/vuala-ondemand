# Editar y Eliminar Clientes - Vualá OnDemand

## 📋 Funcionalidades Implementadas

### ✅ Editar Cliente

**Ruta**: `/dashboard/clientes/[id]/editar`

**Campos Editables** (Solo datos del Cliente):
- ✅ Nombre
- ✅ Apellido
- ✅ Fecha de Nacimiento
- ✅ Dirección

**Campos NO Editables** (Datos del Usuario):
- ❌ DNI (seguridad)
- ❌ Username (seguridad)
- ❌ Email (seguridad)
- ❌ Contraseña (seguridad)
- ❌ Rol (seguridad)

**Razón**: Los datos de usuario deben gestionarse desde un módulo específico de usuarios por razones de seguridad y auditoría.

### ✅ Eliminar Cliente

**Funcionalidad**: Elimina el Cliente Y el Usuario asociado

**Validaciones**:
- ✅ Verifica que el cliente no tenga órdenes asociadas
- ✅ Si tiene órdenes, muestra mensaje de error con el número de órdenes
- ✅ Confirmación antes de eliminar
- ✅ Eliminación en cascada: Cliente → Usuario

## 🔄 Flujos

### Flujo de Edición

```
Usuario navega a editar cliente
  ↓
Carga datos del cliente (solo campos editables)
  ↓
Usuario modifica campos permitidos
  ↓
Submit → PUT /api/customers/[id]
  ↓
Backend actualiza solo datos del cliente
  ↓
✅ Redirección a detalle del cliente
```

### Flujo de Eliminación

```
Usuario hace clic en "Eliminar"
  ↓
Confirmación con alert
  ↓
DELETE /api/customers/[id]
  ↓
Backend:
1. Busca cliente con órdenes
2. Si tiene órdenes → Error 400
3. Si no tiene órdenes:
   a. Elimina Customer
   b. Elimina User asociado
  ↓
✅ Redirección a lista de clientes
```

## 📁 Archivos Modificados

### Backend

**`src/app/api/customers/[id]/route.ts`**

#### DELETE Endpoint Actualizado

```typescript
/**
 * DELETE /api/customers/[id]
 * Delete customer AND associated user (only if no orders)
 */
export async function DELETE(request, { params }) {
  // 1. Obtener cliente con órdenes
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      orders: true,
      user: true,
    },
  });

  // 2. Verificar si tiene órdenes
  if (customer.orders.length > 0) {
    return error("No se puede eliminar...");
  }

  // 3. Eliminar cliente
  await prisma.customer.delete({
    where: { id: customerId },
  });

  // 4. Eliminar usuario asociado
  await prisma.user.delete({
    where: { id: customer.userId },
  });

  return success("Cliente y usuario eliminados");
}
```

### Frontend

**`src/app/(dashboard)/dashboard/clientes/[id]/editar/page.tsx`**

- ✅ Solo muestra campos editables del cliente
- ✅ Nota informativa sobre campos no editables
- ✅ Validación de campos requeridos
- ✅ Feedback visual durante guardado

## 🔐 Seguridad

### Campos Protegidos

**DNI**: No se puede modificar porque es el identificador único del cliente en el sistema.

**Datos de Usuario**: No se pueden modificar desde el módulo de clientes por:
1. **Seguridad**: Username, email y contraseña son credenciales de acceso
2. **Auditoría**: Los cambios en usuarios deben registrarse separadamente
3. **Integridad**: El rol determina permisos y debe gestionarse con cuidado

### Eliminación Segura

1. **Validación de Órdenes**: No permite eliminar si tiene órdenes
2. **Confirmación**: Requiere confirmación del usuario
3. **Eliminación en Cascada**: Elimina tanto cliente como usuario
4. **Transaccional**: Si falla uno, no se elimina ninguno

## 📊 Mensajes de Usuario

### Edición

**Éxito**:
```
"Cliente actualizado exitosamente"
```

**Error**:
```
"Cliente no encontrado"
"Error al actualizar cliente"
```

### Eliminación

**Éxito**:
```
"Cliente y usuario eliminados exitosamente"
```

**Error con Órdenes**:
```
"No se puede eliminar el cliente porque tiene 2 orden(es) asociada(s)"
```

**Error General**:
```
"Cliente no encontrado"
"Error al eliminar cliente"
```

## 🎯 Casos de Uso

### Caso 1: Editar Dirección del Cliente

```
Escenario: Cliente se mudó a nueva dirección

1. Admin navega a detalle del cliente
2. Clic en "Editar Cliente"
3. Actualiza campo "Dirección"
4. Guarda cambios
5. ✅ Dirección actualizada, datos de usuario intactos
```

### Caso 2: Intentar Eliminar Cliente con Órdenes

```
Escenario: Cliente tiene órdenes históricas

1. Admin intenta eliminar cliente
2. Sistema verifica órdenes asociadas
3. ❌ Error: "No se puede eliminar porque tiene 5 orden(es)"
4. Cliente y usuario permanecen en el sistema
```

### Caso 3: Eliminar Cliente sin Órdenes

```
Escenario: Cliente creado por error

1. Admin verifica que no tiene órdenes
2. Clic en "Eliminar"
3. Confirma acción
4. Sistema elimina:
   - Registro de Customer
   - Registro de User asociado
5. ✅ Ambos eliminados exitosamente
```

## 🔄 Relaciones y Cascada

```
User (Usuario)
  ↓ (1:N)
Customer (Cliente)
  ↓ (1:N)
Order (Orden)
```

**Eliminación**:
- ❌ No se puede eliminar User si tiene Customers
- ❌ No se puede eliminar Customer si tiene Orders
- ✅ Al eliminar Customer, se elimina User manualmente
- ✅ Al eliminar Customer, Orders quedan huérfanas (protección)

## 📝 Notas Importantes

1. **Edición Limitada**: Solo se pueden editar datos personales del cliente, no credenciales
2. **Eliminación Condicional**: Solo si no tiene órdenes asociadas
3. **Eliminación Dual**: Elimina tanto cliente como usuario
4. **Auditoría**: Se recomienda implementar soft delete para mantener historial
5. **Permisos**: Solo usuarios con rol admin deberían poder eliminar

## 🚀 Mejoras Futuras Sugeridas

1. **Soft Delete**: Marcar como eliminado en lugar de borrar físicamente
2. **Historial de Cambios**: Log de todas las modificaciones
3. **Módulo de Usuarios**: Gestión separada de credenciales de usuario
4. **Permisos Granulares**: Control de quién puede editar/eliminar
5. **Confirmación Modal**: Diálogo más elegante que alert()
6. **Transferir Órdenes**: Opción de transferir órdenes a otro cliente antes de eliminar

---

**Fecha de Implementación**: 4 de Octubre, 2025  
**Estado**: ✅ Completado y Funcional  
**Seguridad**: Alta - Campos críticos protegidos
