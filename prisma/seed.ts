const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Hash password for demo users (same as in init.sql)
  const hashedPassword = await bcrypt.hash("password", 12);

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@vuala.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@vuala.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: "user@vuala.com" },
    update: {},
    create: {
      name: "Regular User",
      email: "user@vuala.com",
      password: hashedPassword,
      role: "user",
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

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      userId: regularUser.id,
      status: "pending",
      totalAmount: 25.99,
      deliveryAddress: "123 Main St, City, State 12345",
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: regularUser.id,
      status: "delivered",
      totalAmount: 42.5,
      deliveryAddress: "456 Oak Ave, City, State 67890",
    },
  });

  console.log("📦 Created orders:", { order1, order2 });

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
