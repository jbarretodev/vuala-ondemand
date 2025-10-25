// prisma/seed.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password', 12);

  // ---- ROLES ----
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'Administrador del sistema' },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: 'customer' },
    update: {},
    create: { name: 'customer', description: 'Cliente del sistema' },
  });

  const riderRole = await prisma.role.upsert({
    where: { name: 'rider' },
    update: {},
    create: { name: 'rider', description: 'Repartidor' },
  });

  console.log('🎭 Roles:', { admin: adminRole.name, customer: customerRole.name, rider: riderRole.name });

  // ---- USERS ----
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@vuala.com' },
    update: {},
    create: {
      username: 'admin',
      name: 'Admin',
      email: 'admin@vuala.com',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@vuala.com' },
    update: {},
    create: {
      username: 'user',
      name: 'Usuario',
      email: 'user@vuala.com',
      password: hashedPassword,
      roleId: customerRole.id,
    },
  });

  console.log('👥 Users:', { adminUser: adminUser.email, regularUser: regularUser.email });

  // ---- DELIVERY PARTNERS ----
  const deliveryPartner1 = await prisma.deliveryPartner.upsert({
    where: { email: 'partner1@delivery.com' },
    update: {},
    create: { name: 'Express Delivery Co.', email: 'partner1@delivery.com', phone: '+1234567890', status: 'active' },
  });

  const deliveryPartner2 = await prisma.deliveryPartner.upsert({
    where: { email: 'partner2@delivery.com' },
    update: {},
    create: { name: 'Fast Track Logistics', email: 'partner2@delivery.com', phone: '+1987654321', status: 'active' },
  });

  console.log('🚚 Partners:', [deliveryPartner1.email, deliveryPartner2.email]);

  // ---- CUSTOMERS ----
  const customer1 = await prisma.customer.upsert({
    where: { dni: '12345678A' },
    update: {},
    create: {
      name: 'Juan',
      lastname: 'Pérez García',
      address: 'Calle Mayor 123, Madrid, 28001',
      dni: '12345678A',
      dob: new Date('1985-03-15'),
      userId: regularUser.id,
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { dni: '87654321B' },
    update: {},
    create: {
      name: 'María',
      lastname: 'López Martínez',
      address: 'Avenida Diagonal 456, Barcelona, 08001',
      dni: '87654321B',
      dob: new Date('1990-07-22'),
      userId: regularUser.id,
    },
  });

  const customer3 = await prisma.customer.upsert({
    where: { dni: '11223344C' },
    update: {},
    create: {
      name: 'Carlos',
      lastname: 'Rodríguez Sánchez',
      address: 'Plaza España 789, Valencia, 46001',
      dni: '11223344C',
      dob: new Date('1988-11-30'),
      userId: adminUser.id,
    },
  });

  console.log('👥 Customers:', [customer1.dni, customer2.dni, customer3.dni]);

  // ---- ORDERS ----
  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      status: 'pending',
      totalAmount: 25.99,
      pickupAddress: 'Restaurante El Buen Sabor, Calle Sol 10, Madrid',
      deliveryAddress: customer1.address,
      distanceKm: 3.5,
      estimatedTime: '25 min',
      estimatedPrice: 8.5,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      status: 'delivered',
      totalAmount: 42.5,
      pickupAddress: 'Farmacia Central, Calle Luna 25, Madrid',
      deliveryAddress: customer1.address,
      distanceKm: 2.1,
      estimatedTime: '15 min',
      estimatedPrice: 6.0,
    },
  });

  const order3 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      status: 'in_transit',
      totalAmount: 18.75,
      pickupAddress: 'Supermercado Fresh, Rambla Catalunya 100, Barcelona',
      deliveryAddress: customer2.address,
      distanceKm: 4.2,
      estimatedTime: '30 min',
      estimatedPrice: 9.5,
      isScheduled: true,
      scheduledDate: new Date('2025-10-01'),
      scheduledTime: '18:00',
    },
  });

  console.log('📦 Orders:', [order1.id, order2.id, order3.id]);

// ---- RIDERS ----
// Primero crear usuarios para los riders
const riderUsers = [
  { username: 'nico', name: 'Nico', email: 'nico@vuala.com' },
  { username: 'ana', name: 'Ana', email: 'ana@vuala.com' },
  { username: 'luis', name: 'Luis', email: 'luis@vuala.com' },
  { username: 'sofia', name: 'Sofia', email: 'sofia@vuala.com' },
  { username: 'rafa', name: 'Rafa', email: 'rafa@vuala.com' },
  { username: 'irene', name: 'Irene', email: 'irene@vuala.com' },
];

// Crear usuarios para los riders
const createdRiderUsers = await Promise.all(
  riderUsers.map((riderData) =>
    prisma.user.upsert({
      where: { email: riderData.email },
      update: {},
      create: {
        username: riderData.username,
        name: riderData.name,
        email: riderData.email,
        password: hashedPassword,
        roleId: riderRole.id,
      },
    })
  )
);

console.log('👥 Rider users created:', createdRiderUsers.map(u => u.email));

// Ahora crear los riders asociados a esos usuarios
await Promise.all(
  createdRiderUsers.map((user, index) =>
    prisma.rider.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        phone: `+3460000${index + 1}000`,
        status: 'OFFLINE',
        // licenseNumber, rating y otros campos opcionales se pueden omitir
      },
    })
  )
);

console.log('🏍️ Riders seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
