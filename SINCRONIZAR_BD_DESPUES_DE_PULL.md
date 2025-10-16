# 🔄 Comandos para Sincronizar BD Local Después de Git Pull

## ❓ ¿Cuál es el problema?
Cuando haces `git pull` y hay cambios en `prisma/schema.prisma`, esos cambios NO se reflejan automáticamente en tu base de datos local. Esto causa errores como "tabla no existe" o "columna no encontrada".

---

## ✅ Solución: Secuencia de Comandos

### Ejecuta estos comandos EN ORDEN después de cada `git pull`:

```bash
# 1. Instalar/actualizar dependencias
npm install        # Si usas npm
pnpm install       # Si usas pnpm

# 2. Regenerar el cliente de Prisma
npx prisma generate

# 3. Sincronizar el schema con tu BD local
npx prisma db push

# 4. (Opcional) Cargar datos de prueba
npm run db:seed    # Si usas npm
pnpm run db:seed   # Si usas pnpm
```

---

## 📝 ¿Qué hace cada comando?

### 1️⃣ `npm install` / `pnpm install`
- **Para qué sirve:** Instala o actualiza las dependencias del proyecto
- **Cuándo ejecutarlo:** Cuando hay cambios en `package.json` o `package-lock.json`
- **Necesario:** Solo si hay cambios en dependencias

### 2️⃣ `npx prisma generate`
- **Para qué sirve:** Genera el cliente de Prisma basándose en el schema actualizado
- **Cuándo ejecutarlo:** SIEMPRE después de cambios en `prisma/schema.prisma`
- **Necesario:** ✅ SÍ, cada vez que haya cambios en el schema

### 3️⃣ `npx prisma db push`
- **Para qué sirve:** Sincroniza tu base de datos local con el schema de Prisma
- **Cuándo ejecutarlo:** SIEMPRE después de cambios en `prisma/schema.prisma`
- **Necesario:** ✅ SÍ, actualiza las tablas/columnas en tu BD local
- **Importante:** Este comando MODIFICA tu BD local

### 4️⃣ `npm run db:seed` / `pnpm run db:seed`
- **Para qué sirve:** Inserta datos de prueba en la base de datos
- **Cuándo ejecutarlo:** Cuando necesites datos para probar
- **Necesario:** ❌ NO, es opcional

---

## 🚀 Comando Todo-en-Uno (Recomendado)

### Para npm:
```bash
npm install && npx prisma generate && npx prisma db push
```

### Para pnpm:
```bash
pnpm install && npx prisma generate && npx prisma db push
```

### Con seeds (si los necesitas):
```bash
# npm
npm install && npx prisma generate && npx prisma db push && npm run db:seed

# pnpm
pnpm install && npx prisma generate && npx prisma db push && pnpm run db:seed
```

---

## 📋 Flujo de Trabajo Completo

```bash
# 1. Hacer pull de los cambios
git pull

# 2. Sincronizar BD local (escoge según tu gestor de paquetes)
npm install && npx prisma generate && npx prisma db push      # npm
pnpm install && npx prisma generate && npx prisma db push     # pnpm

# 3. Iniciar servidor
npm run dev      # npm
pnpm run dev     # pnpm
```

---

## 🆘 Solución a Errores Comunes

### Error: "Unknown field X in model Y"
```bash
npx prisma generate
```

### Error: "Table X doesn't exist"
```bash
npx prisma db push
```

### Error: "Cannot find module '@prisma/client'"
```bash
npm install && npx prisma generate      # npm
pnpm install && npx prisma generate     # pnpm
```

### Quieres resetear la BD completamente
```bash
npm run db:reset      # npm - Borra todo y carga seeds
pnpm run db:reset     # pnpm - Borra todo y carga seeds
```

---

## 💡 Scripts ya configurados en package.json

Puedes usar estos atajos:

```bash
npm run db:sync              # prisma generate + db push
pnpm run db:sync

npm run db:sync:seed         # prisma generate + db push + seeds
pnpm run db:sync:seed

npm run postpull             # npm install + db:sync (para npm)
pnpm run postpull:pnpm       # pnpm install + db:sync (para pnpm)
```

---

## ⚡ La Forma Más Rápida

Después de `git pull`, ejecuta:

```bash
npm run postpull         # Si usas npm
pnpm run postpull:pnpm   # Si usas pnpm
```

¡Y listo! 🎉

---

## 📌 Resumen Visual

```
git pull
    ↓
¿Hubo cambios en schema.prisma?
    ↓
   SÍ → Ejecutar: npx prisma generate + npx prisma db push
    ↓
Tu BD local ahora tiene las tablas/columnas actualizadas
    ↓
npm run dev / pnpm run dev
```

---

## RESUMEN

Ejecutar comando y que lo ejecute después de cada pull:

```bash
# Si usa npm:
npm install && npx prisma generate && npx prisma db push && npm run dev

# Si usa pnpm:
pnpm install && npx prisma generate && npx prisma db push && pnpm run dev
```

