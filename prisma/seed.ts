const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash("password", 12);

  // Create roles first
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "Administrador del sistema",
    },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: "customer" },
    update: {},
    create: {
      name: "customer",
      description: "Cliente del sistema",
    },
  });

  const riderRole = await prisma.role.upsert({
    where: { name: "rider" },
    update: {},
    create: {
      name: "rider",
      description: "Repartidor",
    },
  });

  console.log("🎭 Created roles:", { adminRole, customerRole, riderRole });

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@vuala.com" },
    update: {},
    create: {
      username: "admin",
      name: "Admin",
      email: "admin@vuala.com",
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: "user@vuala.com" },
    update: {},
    create: {
      username: "user",
      name: "Usuario",
      email: "user@vuala.com",
      password: hashedPassword,
      roleId: customerRole.id,
    },
  });

  console.log("👥 Created users:", { adminUser, regularUser });

  // Create delivery partners
  const deliveryPartner1 = await prisma.deliveryPartner.upsert({
    where: { email: "partner1@delivery.com" },
    update: {},
    create: {
      name: "Express Delivery Co.",
      email: "partner1@delivery.com",
      phone: "+1234567890",
      status: "active",
    },
  });

  const deliveryPartner2 = await prisma.deliveryPartner.upsert({
    where: { email: "partner2@delivery.com" },
    update: {},
    create: {
      name: "Fast Track Logistics",
      email: "partner2@delivery.com",
      phone: "+1987654321",
      status: "active",
    },
  });

  console.log("🚚 Created delivery partners:", {
    deliveryPartner1,
    deliveryPartner2,
  });

  // Create customers
  const customer1 = await prisma.customer.upsert({
    where: { dni: "12345678A" },
    update: {},
    create: {
      name: "Juan",
      lastname: "Pérez García",
      address: "Calle Mayor 123, Madrid, 28001",
      dni: "12345678A",
      dob: new Date("1985-03-15"),
      userId: regularUser.id,
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { dni: "87654321B" },
    update: {},
    create: {
      name: "María",
      lastname: "López Martínez",
      address: "Avenida Diagonal 456, Barcelona, 08001",
      dni: "87654321B",
      dob: new Date("1990-07-22"),
      userId: regularUser.id,
    },
  });

  const customer3 = await prisma.customer.upsert({
    where: { dni: "11223344C" },
    update: {},
    create: {
      name: "Carlos",
      lastname: "Rodríguez Sánchez",
      address: "Plaza España 789, Valencia, 46001",
      dni: "11223344C",
      dob: new Date("1988-11-30"),
      userId: adminUser.id,
    },
  });

  console.log("👥 Created customers:", { customer1, customer2, customer3 });

  // Create sample orders linked to customers
  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      status: "pending",
      totalAmount: 25.99,
      pickupAddress: "Restaurante El Buen Sabor, Calle Sol 10, Madrid",
      deliveryAddress: customer1.address,
      distanceKm: 3.5,
      estimatedTime: "25 min",
      estimatedPrice: 8.50,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      status: "delivered",
      totalAmount: 42.5,
      pickupAddress: "Farmacia Central, Calle Luna 25, Madrid",
      deliveryAddress: customer1.address,
      distanceKm: 2.1,
      estimatedTime: "15 min",
      estimatedPrice: 6.00,
    },
  });

  const order3 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      status: "in_transit",
      totalAmount: 18.75,
      pickupAddress: "Supermercado Fresh, Rambla Catalunya 100, Barcelona",
      deliveryAddress: customer2.address,
      distanceKm: 4.2,
      estimatedTime: "30 min",
      estimatedPrice: 9.50,
      isScheduled: true,
      scheduledDate: new Date("2025-10-01"),
      scheduledTime: "18:00",
    },
  });

  console.log("📦 Created orders:", { order1, order2, order3 });

  console.log("✅ Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
