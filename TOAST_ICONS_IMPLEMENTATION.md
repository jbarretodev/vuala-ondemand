# Toast Notifications e Iconos - Vualá OnDemand

## 📋 Implementación Completada

Se ha implementado un sistema completo de notificaciones toast usando `react-hot-toast` y se han agregado iconos a los botones de acciones.

## 🎨 Sistema de Toast

### Librería Instalada

```bash
pnpm add react-hot-toast
```

### Configuración

**Archivo**: `src/components/providers/ToasterProvider.tsx`

```typescript
<Toaster
  position="top-right"
  reverseOrder={false}
  toastOptions={{
    duration: 4000,
    style: {
      background: "#fff",
      color: "#363636",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    success: {
      duration: 3000,
      iconTheme: {
        primary: "var(--color-brand-500)",
        secondary: "#fff",
      },
    },
    error: {
      duration: 4000,
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    },
  }}
/>
```

### Características

- ✅ **Posición**: Top-right
- ✅ **Duración**: 4 segundos (general), 3 segundos (éxito)
- ✅ **Estilos**: Bordes redondeados, sombra suave
- ✅ **Colores**: Brand color para éxito, rojo para error
- ✅ **Estados**: Loading, Success, Error

## 🔔 Tipos de Toast Implementados

### 1. Loading Toast

```typescript
const loadingToast = toast.loading("Procesando...");
```

**Uso**: Mostrar mientras se realiza una operación asíncrona

### 2. Success Toast

```typescript
toast.success("Operación exitosa", {
  id: loadingToast, // Reemplaza el loading toast
});
```

**Uso**: Confirmar operación exitosa

### 3. Error Toast

```typescript
toast.error("Error al procesar", {
  id: loadingToast, // Reemplaza el loading toast
});
```

**Uso**: Mostrar errores al usuario

## 🎯 Reemplazo de Alerts

### Antes (Alert)

```typescript
alert("Cliente creado exitosamente");
alert("Error al crear cliente");
```

### Ahora (Toast)

```typescript
const loadingToast = toast.loading("Creando cliente...");

// En éxito
toast.success("Cliente creado exitosamente", {
  id: loadingToast,
});

// En error
toast.error("Error al crear cliente", {
  id: loadingToast,
});
```

## 🖼️ Iconos en Botones de Acciones

### Botones Actualizados

#### 1. Ver (Eye Icon)

```tsx
<Link
  href={`/dashboard/clientes/${customer.id}`}
  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[var(--color-brand-500)] hover:bg-[var(--color-brand-50)] transition"
  title="Ver detalles"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
  <span>Ver</span>
</Link>
```

**Características**:
- 👁️ Icono de ojo
- Color brand
- Hover con fondo suave

#### 2. Editar (Edit Icon)

```tsx
<Link
  href={`/dashboard/clientes/${customer.id}/editar`}
  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-blue-600 hover:bg-blue-50 transition"
  title="Editar cliente"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
  <span>Editar</span>
</Link>
```

**Características**:
- ✏️ Icono de lápiz
- Color azul
- Hover con fondo azul suave

#### 3. Eliminar (Trash Icon)

```tsx
<button
  onClick={() => handleDelete(customer.id, name)}
  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50 transition"
  title="Eliminar cliente"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
  <span>Eliminar</span>
</button>
```

**Características**:
- 🗑️ Icono de basura
- Color rojo
- Hover con fondo rojo suave

## 📁 Archivos Modificados

### Providers

1. **`src/components/providers/ToasterProvider.tsx`** (NUEVO)
   - Configuración de react-hot-toast
   - Estilos personalizados

2. **`src/app/layout.tsx`**
   - Importación de ToasterProvider
   - Agregado al árbol de componentes

### Páginas de Clientes

3. **`src/app/(dashboard)/dashboard/clientes/page.tsx`**
   - Toast en eliminación
   - Iconos en botones de acciones
   - Loading, success y error states

4. **`src/app/(dashboard)/dashboard/clientes/nuevo/page.tsx`**
   - Toast en creación
   - Loading, success y error states

5. **`src/app/(dashboard)/dashboard/clientes/[id]/editar/page.tsx`**
   - Toast en actualización
   - Toast en carga de datos
   - Loading, success y error states

## 🎨 Estilos de Botones

### Clases CSS Comunes

```css
/* Base */
inline-flex items-center gap-1 rounded-lg px-3 py-1.5 transition

/* Ver (Brand) */
text-[var(--color-brand-500)] hover:bg-[var(--color-brand-50)]

/* Editar (Azul) */
text-blue-600 hover:bg-blue-50

/* Eliminar (Rojo) */
text-red-600 hover:bg-red-50
```

### Características Visuales

- ✅ Iconos SVG (16x16px)
- ✅ Gap de 4px entre icono y texto
- ✅ Padding horizontal 12px, vertical 6px
- ✅ Border radius 8px
- ✅ Transiciones suaves
- ✅ Tooltips con atributo `title`

## 🔄 Flujos con Toast

### Crear Cliente

```
1. Usuario completa formulario
2. Clic en "Crear Cliente"
3. 🔄 Toast: "Creando cliente y usuario..."
4a. ✅ Toast: "Cliente y usuario creados exitosamente"
4b. ❌ Toast: "Error: [mensaje específico]"
5. Redirección o mostrar error
```

### Editar Cliente

```
1. Usuario modifica campos
2. Clic en "Guardar Cambios"
3. 🔄 Toast: "Actualizando cliente..."
4a. ✅ Toast: "Cliente actualizado exitosamente"
4b. ❌ Toast: "Error al actualizar cliente"
5. Redirección o mostrar error
```

### Eliminar Cliente

```
1. Usuario hace clic en "Eliminar"
2. Confirmación con window.confirm
3. 🔄 Toast: "Eliminando cliente..."
4a. ✅ Toast: "Cliente y usuario eliminados exitosamente"
4b. ❌ Toast: "No se puede eliminar porque tiene X órdenes"
5. Actualizar lista o mostrar error
```

## 📊 Mensajes de Toast

### Operaciones Exitosas

- ✅ "Cliente y usuario creados exitosamente"
- ✅ "Cliente actualizado exitosamente"
- ✅ "Cliente y usuario eliminados exitosamente"

### Estados de Carga

- 🔄 "Creando cliente y usuario..."
- 🔄 "Actualizando cliente..."
- 🔄 "Eliminando cliente..."

### Errores

- ❌ "Error al crear cliente"
- ❌ "Error al actualizar cliente"
- ❌ "Error al eliminar cliente"
- ❌ "No se puede eliminar el cliente porque tiene X orden(es) asociada(s)"
- ❌ "Las contraseñas no coinciden"
- ❌ "El username o email ya está en uso"

## 🎯 Beneficios

### UX Mejorada

1. **Feedback Visual**: Usuario siempre sabe qué está pasando
2. **No Bloqueante**: Toast no bloquea la interfaz como alert()
3. **Profesional**: Apariencia moderna y pulida
4. **Informativo**: Mensajes claros y específicos

### Desarrollo

1. **Consistente**: Mismo patrón en toda la app
2. **Reutilizable**: Fácil de implementar en nuevas páginas
3. **Configurable**: Estilos y duración personalizables
4. **Mantenible**: Código limpio y organizado

## 🚀 Uso en Nuevas Páginas

### Template Básico

```typescript
import toast from "react-hot-toast";

const handleAction = async () => {
  const loadingToast = toast.loading("Procesando...");

  try {
    const response = await fetch("/api/endpoint", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success("Operación exitosa", {
        id: loadingToast,
      });
    } else {
      toast.error("Error en la operación", {
        id: loadingToast,
      });
    }
  } catch (error) {
    toast.error("Error inesperado", {
      id: loadingToast,
    });
  }
};
```

## 📝 Notas Importantes

1. **ID del Toast**: Usar el mismo ID para reemplazar el loading toast
2. **Duración**: Success 3s, Error 4s, Loading infinito
3. **Posición**: Top-right para no interferir con contenido
4. **Iconos**: SVG inline para mejor rendimiento
5. **Accesibilidad**: Tooltips en botones con `title`

---

**Fecha de Implementación**: 4 de Octubre, 2025  
**Estado**: ✅ Completado y Funcional  
**Librería**: react-hot-toast v2.6.0
