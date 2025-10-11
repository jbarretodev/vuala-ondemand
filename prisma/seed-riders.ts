import { PrismaClient, RiderStatus, VehicleType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedRiders() {
  console.log('🏍️  Starting riders seed...');

  try {
    // Get or create rider role
    let riderRole = await prisma.role.findUnique({
      where: { name: 'rider' },
    });

    if (!riderRole) {
      console.log('⚠️  Rider role not found, creating it...');
      riderRole = await prisma.role.create({
        data: {
          name: 'rider',
          description: 'Repartidor',
        },
      });
      console.log('✅ Rider role created');
    }

    // Create rider users
    const riders = [
      {
        username: 'rider1',
        name: 'Carlos Ramírez',
        email: 'rider1@vuala.com',
        password: '$2b$12$hWrdRi4It8O7rmMgfNaLjODsYDjEvYrQb.diAiX1CLI9fEo51PxAC', // "password"
        phone: '+58 412 1234567',
        licenseNumber: 'LIC-001-2024',
        vehicle: {
          type: VehicleType.MOTORCYCLE,
          brand: 'Honda',
          model: 'CB125',
          year: 2022,
          licensePlate: 'ABC-123',
          color: 'Negro',
        },
      },
      {
        username: 'rider2',
        name: 'María González',
        email: 'rider2@vuala.com',
        password: '$2b$12$hWrdRi4It8O7rmMgfNaLjODsYDjEvYrQb.diAiX1CLI9fEo51PxAC', // "password"
        phone: '+58 414 7654321',
        licenseNumber: 'LIC-002-2024',
        vehicle: {
          type: VehicleType.MOTORCYCLE,
          brand: 'Yamaha',
          model: 'FZ150',
          year: 2023,
          licensePlate: 'XYZ-789',
          color: 'Azul',
        },
      },
      {
        username: 'rider3',
        name: 'José Martínez',
        email: 'rider3@vuala.com',
        password: '$2b$12$hWrdRi4It8O7rmMgfNaLjODsYDjEvYrQb.diAiX1CLI9fEo51PxAC', // "password"
        phone: '+58 424 9876543',
        licenseNumber: 'LIC-003-2024',
        vehicle: {
          type: VehicleType.CAR,
          brand: 'Toyota',
          model: 'Corolla',
          year: 2021,
          licensePlate: 'CAR-456',
          color: 'Blanco',
        },
      },
    ];

    for (const riderData of riders) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: riderData.email },
      });

      if (existingUser) {
        console.log(`⚠️  User ${riderData.email} already exists, skipping...`);
        continue;
      }

      // Create user and rider in transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            username: riderData.username,
            name: riderData.name,
            email: riderData.email,
            password: riderData.password,
            roleId: riderRole.id,
          },
        });

        // Create rider profile
        const rider = await tx.rider.create({
          data: {
            userId: user.id,
            phone: riderData.phone,
            licenseNumber: riderData.licenseNumber,
            status: RiderStatus.IDLE,
            isActive: true,
            vehicle: {
              create: riderData.vehicle,
            },
          },
          include: {
            vehicle: true,
          },
        });

        // Create initial location (sample location in Caracas)
        await tx.riderLastLocation.create({
          data: {
            riderId: rider.id,
            lat: 10.4806 + (Math.random() - 0.5) * 0.1, // Random around Caracas
            lng: -66.9036 + (Math.random() - 0.5) * 0.1,
            speed: 0,
            heading: 0,
            accuracy: 10,
            battery: Math.floor(Math.random() * 30) + 70, // 70-100%
            source: 'android',
            timestamp: new Date(),
          },
        });

        return { user, rider };
      });

      console.log(`✅ Created rider: ${result.user.name} (${result.user.email})`);
    }

    console.log('✅ Riders seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding riders:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedRiders()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
