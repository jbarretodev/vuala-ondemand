# Seed de 100 Riders - Documentación

## 📋 Descripción

Script para crear 100 couriers de prueba con distribución realista de vehículos, ubicaciones en Caracas y datos variados.

## 🚀 Ejecutar el Seed

```bash
pnpm run db:seed:100riders
```

## 📊 Distribución de Vehículos

El seed crea exactamente 100 riders con la siguiente distribución:

| Tipo de Vehículo | Cantidad | Porcentaje |
|------------------|----------|------------|
| 🏍️ Motocicletas | 50 | 50% |
| 🚗 Carros | 30 | 30% |
| 🚲 Bicicletas | 10 | 10% |
| 🛵 Scooters | 10 | 10% |

### Motocicletas (50 riders)

**Marcas disponibles:**
- **Honda**: CB125, CB190, XR150, Wave, CG125
- **Yamaha**: FZ150, YBR125, XTZ125, Crypton, BWS
- **Suzuki**: GSX150, EN125, GN125, Gixxer
- **Bajaj**: Pulsar 135, Pulsar 180, Discover, Platina
- **TVS**: Apache 160, Apache 200, Star City

### Carros (30 riders)

**Marcas disponibles:**
- **Toyota**: Corolla, Yaris, Camry, RAV4, Avanza
- **Chevrolet**: Spark, Aveo, Cruze, Sail, Tracker
- **Hyundai**: Accent, Elantra, i10, Tucson, Creta
- **Nissan**: Versa, Sentra, March, Kicks, Frontier
- **Ford**: Fiesta, Focus, Escape, Ranger, EcoSport
- **Volkswagen**: Gol, Polo, Jetta, Tiguan, Amarok

### Bicicletas (10 riders)

**Marcas disponibles:**
- **Giant**: Escape 3, Talon, ATX, Contend
- **Trek**: FX 1, Marlin, Domane, Dual Sport
- **Specialized**: Sirrus, Rockhopper, Allez, Crosstrail
- **Scott**: Sub Cross, Aspect, Speedster

### Scooters (10 riders)

**Marcas disponibles:**
- **Vespa**: Primavera, Sprint, GTS, LX
- **Honda**: PCX, ADV 150, Dio, Activa
- **Yamaha**: NMAX, Ray, Fascino, Aerox
- **Suzuki**: Burgman, Address, Let's

## 👥 Datos de los Riders

### Información Personal

**Nombres y Apellidos:**
- 50 nombres venezolanos diferentes
- 50 apellidos venezolanos diferentes
- Combinaciones aleatorias para crear diversidad

**Ejemplos:**
- Carlos García
- María Rodríguez
- José Martínez
- Ana González
- Luis López

### Credenciales

**Formato de username:** `rider001`, `rider002`, ..., `rider100`

**Formato de email:** `rider001@vuala.com`, `rider002@vuala.com`, etc.

**Password para todos:** `password`

### Contacto

**Teléfonos:** 
- Formato venezolano: `+58 XXX XXXXXXX`
- Prefijos: 412, 414, 424, 416, 426
- Ejemplo: `+58 412 7654321`

**Licencias:**
- Formato: `LIC-XXXX-2024`
- Ejemplo: `LIC-0001-2024`, `LIC-0042-2024`
- Numeradas secuencialmente

## 🚗 Detalles de Vehículos

### Placas
- Formato: `ABC-123`
- 3 letras + guión + 3 números
- Generadas aleatoriamente
- Únicas para cada vehículo

### Colores Disponibles
- Negro
- Blanco
- Gris
- Rojo
- Azul
- Verde
- Amarillo
- Plateado
- Naranja
- Morado

### Años
- Rango: 2015 - 2024
- Asignados aleatoriamente

## 📍 Ubicaciones en Caracas

Los riders están distribuidos en 10 zonas diferentes de Caracas:

| Zona | Coordenadas Aproximadas |
|------|------------------------|
| El Paraíso | 10.4920, -66.8970 |
| Chacao | 10.4970, -66.8520 |
| Los Palos Grandes | 10.4980, -66.8420 |
| La Candelaria | 10.4730, -66.9160 |
| Petare | 10.4720, -66.8060 |
| Catia | 10.4940, -66.9600 |
| El Valle | 10.4520, -66.9080 |
| Altamira | 10.5000, -66.8390 |
| La Castellana | 10.4960, -66.8470 |
| Los Chaguaramos | 10.4910, -66.8830 |

**Características:**
- Cada rider se asigna a una zona aleatoria
- Se agrega variación de ±0.02 grados (≈2km) a las coordenadas base
- Ubicaciones más realistas y distribuidas

## 📊 Estados de los Riders

### Distribución de Estados

| Estado | Porcentaje | Descripción |
|--------|-----------|-------------|
| IDLE | ~70% | Disponible para órdenes |
| ON_DELIVERY | ~20% | En proceso de entrega |
| OFFLINE | ~10% | No disponible |

### Estado de Activación

- **Activos**: ~90% de los riders
- **Inactivos**: ~10% de los riders

## ⭐ Calificaciones y Estadísticas

### Rating
- Rango: 3.50 - 5.00
- Generado aleatoriamente
- 2 decimales de precisión
- Promedio esperado: ~4.25

### Órdenes Completadas
- Rango: 0 - 500
- Generado aleatoriamente
- Representa el historial del courier

## 📍 Datos de Ubicación

### Última Ubicación (RiderLastLocation)

Para cada rider se crea:
- **Latitud/Longitud**: Basada en la zona asignada
- **Velocidad**: 0 km/h si IDLE/OFFLINE, 5-40 km/h si ON_DELIVERY
- **Rumbo**: 0-360 grados (aleatorio)
- **Precisión**: 5-20 metros
- **Batería**: 20-100%
- **Fuente**: Android o iOS (aleatorio)
- **Timestamp**: Fecha y hora actual

### Historial de Ubicaciones (RiderLocation)

Cada rider tiene 5-10 puntos históricos:
- Generados con intervalos de 2-5 minutos
- Ubicaciones cercanas a la posición inicial (±0.01 grados)
- Incluyen velocidad, rumbo y precisión
- Timestamps en orden cronológico inverso

## 🎲 Características de Aleatoriedad

El script utiliza aleatoriedad para:
1. ✅ Combinación de nombre y apellido
2. ✅ Selección de zona en Caracas
3. ✅ Tipo de vehículo (según distribución)
4. ✅ Marca y modelo del vehículo
5. ✅ Color del vehículo
6. ✅ Año del vehículo (2015-2024)
7. ✅ Placa (único)
8. ✅ Número de teléfono
9. ✅ Estado del rider (IDLE/ON_DELIVERY/OFFLINE)
10. ✅ Estado activo/inactivo
11. ✅ Rating (3.5-5.0)
12. ✅ Órdenes completadas (0-500)
13. ✅ Nivel de batería (20-100%)
14. ✅ Fuente de ubicación (Android/iOS)
15. ✅ Variaciones en coordenadas GPS
16. ✅ Cantidad de puntos históricos (5-10)

## 🔍 Verificación de Datos

### Validaciones
- ✅ No crea riders duplicados (verifica por email)
- ✅ Todas las placas son únicas
- ✅ Todos los usernames son únicos
- ✅ Todas las ubicaciones están en Caracas
- ✅ Todos los datos obligatorios están presentes

### Integridad Referencial
- ✅ User → Rider (1:1)
- ✅ Rider → Vehicle (1:1)
- ✅ Rider → RiderLastLocation (1:1)
- ✅ Rider → RiderLocation[] (1:N)

## 📈 Salida del Script

El script muestra información durante la ejecución:

```
🏍️  Starting seed for 100 riders...
📊 Vehicle distribution:
   - Motorcycles: 50
   - Cars: 30
   - Bicycles: 10
   - Scooters: 10

   ✅ Created 10 riders...
   ✅ Created 20 riders...
   ✅ Created 30 riders...
   ...
   ✅ Created 100 riders...

✅ Seed completed successfully!
   📊 Total created: 100
   ⚠️  Skipped (already exist): 0

🔐 All riders have the same password for testing: "password"
📧 Email format: rider001@vuala.com, rider002@vuala.com, etc.

📍 Riders distributed across Caracas areas:
   - El Paraíso
   - Chacao
   - Los Palos Grandes
   - La Candelaria
   - Petare
   - Catia
   - El Valle
   - Altamira
   - La Castellana
   - Los Chaguaramos
```

## 🧪 Testing y Uso

### Cuentas de Prueba

Puedes usar cualquiera de estas cuentas:

```
Email: rider001@vuala.com
Password: password

Email: rider050@vuala.com
Password: password

Email: rider100@vuala.com
Password: password
```

### Casos de Uso

**1. Testing de Lista**
- Ver paginación con 100 riders
- Probar filtros por estado
- Probar búsqueda

**2. Testing de Mapa**
- Visualizar distribución en Caracas
- Ver riders por zona
- Seguimiento en tiempo real

**3. Testing de Estadísticas**
- Analizar distribución de vehículos
- Ver ratings promedio
- Analizar órdenes completadas

**4. Testing de Performance**
- Queries con muchos datos
- Paginación eficiente
- Filtros rápidos

## 🔄 Ejecutar Múltiples Veces

Si ejecutas el script múltiples veces:
- ✅ Detecta riders existentes
- ✅ Los salta automáticamente
- ✅ Solo crea los faltantes
- ✅ No duplica datos

**Ejemplo:**
```bash
# Primera ejecución: Crea 100 riders
pnpm run db:seed:100riders
# Total created: 100, Skipped: 0

# Segunda ejecución: No crea nada
pnpm run db:seed:100riders
# Total created: 0, Skipped: 100
```

## 🗑️ Limpiar y Volver a Crear

Para empezar de cero:

```bash
# Opción 1: Borrar solo riders
# (Usar Prisma Studio o SQL directo)

# Opción 2: Reset completo de la BD
pnpm run db:reset

# Luego crear 100 riders nuevos
pnpm run db:seed:100riders
```

## 📊 Estadísticas Esperadas

Después de ejecutar el seed:

### Total de Registros Creados
- 100 Users
- 100 Riders
- 100 Vehicles
- 100 RiderLastLocation
- 550-1000 RiderLocation (5-10 por rider)

### Distribución por Estado
- ~70 riders IDLE
- ~20 riders ON_DELIVERY
- ~10 riders OFFLINE

### Distribución Activos/Inactivos
- ~90 riders activos
- ~10 riders inactivos

## 🎯 Recomendaciones

1. **Ejecutar después de migraciones**
   ```bash
   pnpm dlx prisma migrate dev
   pnpm run db:seed:100riders
   ```

2. **Verificar en Prisma Studio**
   ```bash
   pnpm run db:studio
   ```

3. **Probar en el frontend**
   - Ir a `/dashboard/riders`
   - Verificar que aparecen todos
   - Probar filtros y paginación

4. **Monitorear performance**
   - Con 100 riders, las queries deben seguir siendo rápidas
   - Si es lento, agregar más índices

## 🐛 Troubleshooting

### Error: "Role 'rider' not found"
**Solución:** Ejecutar primero el seed básico
```bash
pnpm run db:seed
pnpm run db:seed:100riders
```

### Error: "User already exists"
**Solución:** Normal, el script salta usuarios existentes

### Error: TypeScript errors
**Solución:** Regenerar Prisma Client
```bash
pnpm dlx prisma generate
```

### Proceso muy lento
**Solución:** Es normal, crear 100+ registros toma 1-2 minutos

## 📝 Notas Técnicas

- Usa transacciones para garantizar atomicidad
- Genera datos realistas basados en Venezuela
- Optimizado para ~2 minutos de ejecución
- Incluye progreso en consola cada 10 riders
- Maneja errores gracefully
- Limpia conexiones al finalizar

---

**Autor**: Sistema de Courier Management  
**Fecha**: Octubre 11, 2025  
**Versión**: 1.0.0
