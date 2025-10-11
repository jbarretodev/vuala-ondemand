# Sistema de Riders/Repartidores - Vualá OnDemand

## 📋 Descripción General

Sistema completo de gestión de repartidores (riders) con seguimiento en tiempo real, gestión de vehículos y asignación de órdenes.

## 🗄️ Modelos de Base de Datos

### Rider
Perfil principal del repartidor vinculado a un usuario.

```prisma
model Rider {
  id              Int          @id @default(autoincrement())
  userId          Int          @unique
  status          RiderStatus  @default(OFFLINE)
  phone           String
  licenseNumber   String?
  isActive        Boolean      @default(true)
  rating          Decimal?     @db.Decimal(3, 2)
  completedOrders Int          @default(0)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}
```

**Campos:**
- `userId` - Relación 1-1 con User (debe tener roleId: 3 "rider")
- `status` - Estado actual: OFFLINE, IDLE, ON_DELIVERY
- `phone` - Teléfono de contacto
- `licenseNumber` - Número de licencia de conducir (opcional)
- `isActive` - Si el rider está activo en el sistema
- `rating` - Calificación promedio (0.00 - 5.00)
- `completedOrders` - Contador de entregas completadas

### Vehicle
Información del vehículo del repartidor.

```prisma
model Vehicle {
  id            Int         @id @default(autoincrement())
  riderId       Int         @unique
  type          VehicleType
  brand         String?
  model         String?
  year          Int?
  licensePlate  String      @unique
  color         String?
}
```

**Tipos de vehículos:**
- `MOTORCYCLE` - Motocicleta
- `CAR` - Automóvil
- `BICYCLE` - Bicicleta
- `SCOOTER` - Scooter

### RiderLastLocation
Última ubicación conocida del repartidor (relación 1-1).

```prisma
model RiderLastLocation {
  riderId   Int      @id
  lat       Float
  lng       Float
  speed     Float?
  heading   Float?
  accuracy  Float?
  battery   Int?
  source    String?  // ios/android/web
  timestamp DateTime
}
```

### RiderLocation
Historial de ubicaciones (relación 1-N).

```prisma
model RiderLocation {
  id        BigInt   @id @default(autoincrement())
  riderId   Int
  lat       Float
  lng       Float
  speed     Float?
  heading   Float?
  accuracy  Float?
  timestamp DateTime
}
```

## 🔌 API Endpoints

### Riders

#### `GET /api/riders`
Obtener lista de repartidores con filtros.

**Query Parameters:**
- `page` - Número de página (default: 1)
- `limit` - Límite por página (default: 10)
- `status` - Filtrar por estado: OFFLINE, IDLE, ON_DELIVERY
- `isActive` - Filtrar por activos/inactivos: true/false

**Response:**
```json
{
  "riders": [...],
  "total": 25,
  "pages": 3,
  "currentPage": 1
}
```

#### `POST /api/riders`
Crear nuevo repartidor (solo admin).

**Body:**
```json
{
  "userId": 10,
  "phone": "+58 412 1234567",
  "licenseNumber": "LIC-001-2024",
  "vehicle": {
    "type": "MOTORCYCLE",
    "brand": "Honda",
    "model": "CB125",
    "year": 2022,
    "licensePlate": "ABC-123",
    "color": "Negro"
  }
}
```

#### `GET /api/riders/[id]`
Obtener detalles de un repartidor específico.

#### `PATCH /api/riders/[id]`
Actualizar repartidor.

**Body opciones:**
```json
// Cambiar estado
{ "status": "IDLE" }

// Toggle activo/inactivo
{ "isActive": true }

// Actualizar rating
{ "rating": 4.5 }

// Actualizar vehículo
{
  "vehicle": {
    "type": "CAR",
    "licensePlate": "XYZ-789"
  }
}
```

#### `DELETE /api/riders/[id]`
Eliminar repartidor (solo admin).

### Ubicación

#### `POST /api/riders/location`
Actualizar ubicación del repartidor (rider autenticado).

**Body:**
```json
{
  "lat": 10.4806,
  "lng": -66.9036,
  "speed": 25.5,
  "heading": 180,
  "accuracy": 10,
  "battery": 85,
  "source": "android"
}
```

#### `GET /api/riders/location?riderId=X`
Obtener historial de ubicaciones.

**Query Parameters:**
- `riderId` - ID del rider (requerido)
- `from` - Fecha desde (ISO 8601)
- `to` - Fecha hasta (ISO 8601)
- `limit` - Límite de registros (default: 100)

### Disponibilidad

#### `GET /api/riders/available`
Obtener riders disponibles (status IDLE y activos).

**Response:**
```json
{
  "riders": [...],
  "count": 5
}
```

## 🛠️ Servicios (RiderService)

### Métodos Principales

```typescript
// Crear rider
RiderService.createRider(data)

// Obtener por ID
RiderService.getRiderById(id)

// Obtener por userId
RiderService.getRiderByUserId(userId)

// Listar con filtros
RiderService.getAllRiders(filters)

// Obtener disponibles
RiderService.getAvailableRiders()

// Actualizar estado
RiderService.updateStatus(id, status)

// Toggle activo/inactivo
RiderService.toggleActive(id)

// Actualizar ubicación
RiderService.updateLocation(riderId, locationData)

// Historial de ubicaciones
RiderService.getLocationHistory(riderId, filters)

// Actualizar vehículo
RiderService.updateVehicle(riderId, vehicleData)

// Asignar orden
RiderService.assignOrder(riderId, orderId)

// Completar entrega
RiderService.completeOrder(riderId, orderId)

// Actualizar rating
RiderService.updateRating(riderId, rating)
```

## 🚀 Flujo de Trabajo

### 1. Registro de Rider
```typescript
// 1. Crear usuario con roleId: 3 (rider)
const user = await prisma.user.create({
  data: {
    username: "rider1",
    name: "Carlos Ramírez",
    email: "rider1@vuala.com",
    password: hashedPassword,
    roleId: 3
  }
});

// 2. Crear perfil de rider
const rider = await RiderService.createRider({
  userId: user.id,
  phone: "+58 412 1234567",
  licenseNumber: "LIC-001-2024",
  vehicleData: {
    type: VehicleType.MOTORCYCLE,
    brand: "Honda",
    model: "CB125",
    year: 2022,
    licensePlate: "ABC-123",
    color: "Negro"
  }
});
```

### 2. Actualización de Ubicación (Cliente Móvil)
```typescript
// El rider debe enviar su ubicación periódicamente
setInterval(async () => {
  const position = await getCurrentPosition();
  
  await fetch('/api/riders/location', {
    method: 'POST',
    body: JSON.stringify({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      speed: position.coords.speed,
      heading: position.coords.heading,
      accuracy: position.coords.accuracy,
      battery: await getBatteryLevel(),
      source: 'android'
    })
  });
}, 10000); // Cada 10 segundos
```

### 3. Asignación de Orden
```typescript
// 1. Obtener riders disponibles
const availableRiders = await RiderService.getAvailableRiders();

// 2. Seleccionar el mejor rider (por rating, distancia, etc)
const bestRider = selectBestRider(availableRiders, orderLocation);

// 3. Asignar la orden
await RiderService.assignOrder(bestRider.id, orderId);
// Esto cambia el status del rider a ON_DELIVERY automáticamente
```

### 4. Completar Entrega
```typescript
// Cuando el rider completa la entrega
await RiderService.completeOrder(riderId, orderId);
// Esto:
// - Actualiza el status de la orden a "delivered"
// - Cambia el status del rider a IDLE
// - Incrementa completedOrders del rider
```

## 📱 Páginas Frontend

### `/dashboard/riders`
Lista de todos los repartidores con filtros:
- Todos
- Activos
- Disponibles
- En entrega
- Inactivos

**Características:**
- Vista de tarjetas con información del rider
- Estado en tiempo real
- Acciones rápidas (activar/desactivar)
- Ver detalles
- Paginación

### `/dashboard/riders/[id]` (Pendiente)
Página de detalles del rider:
- Información completa
- Mapa con ubicación en tiempo real
- Historial de entregas
- Estadísticas
- Editar información

### `/dashboard/riders/new` (Pendiente)
Formulario para crear nuevo rider:
- Información personal
- Datos de contacto
- Información del vehículo
- Foto de perfil

## 🗃️ Datos de Prueba

Ejecutar seed de riders:

```bash
pnpm tsx prisma/seed-riders.ts
```

Esto crea 3 riders de ejemplo:
1. **Carlos Ramírez** - Honda CB125 (Moto)
2. **María González** - Yamaha FZ150 (Moto)
3. **José Martínez** - Toyota Corolla (Carro)

**Credenciales:**
- Email: `rider1@vuala.com`, `rider2@vuala.com`, `rider3@vuala.com`
- Password: `password`

## 🔐 Seguridad

### Permisos por Rol

**Admin:**
- ✅ Ver todos los riders
- ✅ Crear riders
- ✅ Editar riders
- ✅ Eliminar riders
- ✅ Ver ubicaciones

**Rider:**
- ✅ Ver su propio perfil
- ✅ Actualizar su ubicación
- ✅ Ver sus órdenes asignadas
- ❌ Ver otros riders

**Customer:**
- ✅ Ver rider asignado a su orden
- ❌ Ver lista de riders
- ❌ Ver ubicaciones de otros

## 📊 Métricas y Analytics

### Métricas por Rider
- Total de entregas completadas
- Rating promedio
- Tiempo promedio de entrega
- Distancia total recorrida
- Tasa de aceptación de órdenes

### Métricas del Sistema
- Riders activos en tiempo real
- Riders disponibles
- Riders en entrega
- Promedio de entregas por día
- Cobertura geográfica

## 🔄 Estados del Rider

```
┌─────────┐
│ OFFLINE │ ◄─── Rider desconectado/inactivo
└────┬────┘
     │
     ▼
┌─────────┐
│  IDLE   │ ◄─── Rider disponible para asignación
└────┬────┘
     │
     ▼
┌──────────────┐
│ ON_DELIVERY  │ ◄─── Rider realizando entrega
└──────────────┘
```

**Transiciones:**
- `OFFLINE → IDLE`: Rider se conecta y está disponible
- `IDLE → ON_DELIVERY`: Se asigna una orden
- `ON_DELIVERY → IDLE`: Completa la entrega
- `CUALQUIERA → OFFLINE`: Rider se desconecta

## 🚧 Próximas Mejoras

1. **Tracking en Tiempo Real**
   - WebSocket para actualizaciones en vivo
   - Mapa con todos los riders activos
   - Ruta de entrega en tiempo real

2. **Sistema de Asignación Inteligente**
   - Algoritmo de matching rider-orden
   - Considerar: distancia, rating, tiempo estimado
   - Priorización de órdenes

3. **Notificaciones Push**
   - Nueva orden asignada
   - Actualizaciones de estado
   - Mensajes del cliente

4. **Gestión de Zonas**
   - Definir zonas de cobertura
   - Asignar riders a zonas específicas
   - Análisis de demanda por zona

5. **Sistema de Calificaciones**
   - Clientes califican riders
   - Comentarios y retroalimentación
   - Bonos por buen desempeño

6. **Panel de Control para Riders**
   - App móvil dedicada
   - Estadísticas personales
   - Historial de ganancias
   - Mapa de órdenes disponibles

## 📝 Notas Técnicas

- Todas las ubicaciones usan coordenadas WGS84 (lat/lng)
- Los timestamps son UTC
- La batería se almacena como porcentaje (0-100)
- El heading es en grados (0-360, donde 0 = Norte)
- La velocidad está en metros por segundo
- La accuracy es en metros

## 🐛 Troubleshooting

### Prisma Client no reconoce los nuevos modelos
```bash
# Detener el servidor de desarrollo
# Luego regenerar Prisma Client
pnpm dlx prisma generate
```

### Error al actualizar ubicación
- Verificar que el usuario tenga un perfil de rider asociado
- Verificar que lat/lng sean números válidos
- Verificar que el rider esté autenticado

### Riders no aparecen en la lista
- Verificar que existan riders en la BD
- Ejecutar seed: `pnpm tsx prisma/seed-riders.ts`
- Verificar filtros aplicados
