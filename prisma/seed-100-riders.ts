import { PrismaClient, RiderStatus, VehicleType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Nombres españoles
const firstNames = [
  'Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Pedro', 'Rosa', 'Miguel', 'Elena',
  'Andrés', 'Laura', 'Rafael', 'Isabel', 'Diego', 'Patricia', 'Javier', 'Daniela', 'Jesús', 'Cristina',
  'Fernando', 'Marta', 'Ricardo', 'Sofía', 'Alberto', 'Carolina', 'Manuel', 'Alejandra', 'Francisco', 'Victoria',
  'Antonio', 'Raquel', 'Ramón', 'Andrea', 'Sergio', 'Lucía', 'Enrique', 'Paula', 'Pablo', 'Mónica',
  'Roberto', 'Natalia', 'Julio', 'Sandra', 'David', 'Adriana', 'Héctor', 'Beatriz', 'Arturo', 'Claudia'
];

const lastNames = [
  'García', 'Rodríguez', 'Martínez', 'González', 'López', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres',
  'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Jiménez', 'Romero', 'Álvarez',
  'Castillo', 'Ruiz', 'Mendoza', 'Vásquez', 'Castro', 'Ortiz', 'Silva', 'Medina', 'Rojas', 'Vargas',
  'Salazar', 'Núñez', 'Gutiérrez', 'Ramos', 'Navarro', 'Campos', 'Herrera', 'Moreno', 'Durán', 'Vega',
  'Chávez', 'Blanco', 'Cabrera', 'León', 'Paredes', 'Molina', 'Suárez', 'Delgado', 'Cortés', 'Figueroa'
];

// Marcas y modelos de vehículos por tipo
const vehicles = {
  MOTORCYCLE: [
    { brand: 'Honda', models: ['CB125', 'CB190', 'XR150', 'Wave', 'CG125'] },
    { brand: 'Yamaha', models: ['FZ150', 'YBR125', 'XTZ125', 'Crypton', 'BWS'] },
    { brand: 'Suzuki', models: ['GSX150', 'EN125', 'GN125', 'Gixxer'] },
    { brand: 'Bajaj', models: ['Pulsar 135', 'Pulsar 180', 'Discover', 'Platina'] },
    { brand: 'TVS', models: ['Apache 160', 'Apache 200', 'Star City'] },
  ],
  CAR: [
    { brand: 'Toyota', models: ['Corolla', 'Yaris', 'Camry', 'RAV4', 'Avanza'] },
    { brand: 'Chevrolet', models: ['Spark', 'Aveo', 'Cruze', 'Sail', 'Tracker'] },
    { brand: 'Hyundai', models: ['Accent', 'Elantra', 'i10', 'Tucson', 'Creta'] },
    { brand: 'Nissan', models: ['Versa', 'Sentra', 'March', 'Kicks', 'Frontier'] },
    { brand: 'Ford', models: ['Fiesta', 'Focus', 'Escape', 'Ranger', 'EcoSport'] },
    { brand: 'Volkswagen', models: ['Gol', 'Polo', 'Jetta', 'Tiguan', 'Amarok'] },
  ],
  BICYCLE: [
    { brand: 'Giant', models: ['Escape 3', 'Talon', 'ATX', 'Contend'] },
    { brand: 'Trek', models: ['FX 1', 'Marlin', 'Domane', 'Dual Sport'] },
    { brand: 'Specialized', models: ['Sirrus', 'Rockhopper', 'Allez', 'Crosstrail'] },
    { brand: 'Scott', models: ['Sub Cross', 'Aspect', 'Speedster'] },
  ],
  SCOOTER: [
    { brand: 'Vespa', models: ['Primavera', 'Sprint', 'GTS', 'LX'] },
    { brand: 'Honda', models: ['PCX', 'ADV 150', 'Dio', 'Activa'] },
    { brand: 'Yamaha', models: ['NMAX', 'Ray', 'Fascino', 'Aerox'] },
    { brand: 'Suzuki', models: ['Burgman', 'Address', 'Let\'s'] },
  ],
};

const colors = ['Negro', 'Blanco', 'Gris', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Plateado', 'Naranja', 'Morado'];

// Áreas de Almería, España (coordenadas dentro del área marcada)
const almeriaAreas = [
  { name: 'Centro', lat: 36.8402, lng: -2.4681 },
  { name: 'Zapillo', lat: 36.8323, lng: -2.4398 },
  { name: 'Nueva Almería', lat: 36.8225, lng: -2.4521 },
  { name: 'El Ingenio', lat: 36.8515, lng: -2.4378 },
  { name: 'Los Ángeles', lat: 36.8568, lng: -2.4598 },
  { name: 'Oliveros', lat: 36.8295, lng: -2.4785 },
  { name: 'La Cañada', lat: 36.8476, lng: -2.4812 },
  { name: 'Huércal de Almería', lat: 36.8612, lng: -2.4298 },
  { name: 'Viator', lat: 36.8798, lng: -2.4315 },
  { name: 'Costacabana', lat: 36.8156, lng: -2.4423 },
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomVehicle(type: VehicleType) {
  const vehiclesByType = vehicles[type];
  const brandData = getRandomElement(vehiclesByType);
  const model = getRandomElement(brandData.models);
  const color = getRandomElement(colors);
  const year = getRandomInt(2015, 2024);
  
  return {
    type,
    brand: brandData.brand,
    model,
    color,
    year,
  };
}

function generateLicensePlate(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let plate = '';
  for (let i = 0; i < 3; i++) {
    plate += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  plate += '-';
  for (let i = 0; i < 3; i++) {
    plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return plate;
}

function generatePhone(): string {
  // Prefijos móviles españoles: 6XX, 7XX
  const firstDigit = getRandomElement(['6', '7']);
  const number1 = getRandomInt(10, 99);
  const number2 = getRandomInt(100, 999);
  const number3 = getRandomInt(100, 999);
  return `+34 ${firstDigit}${number1} ${number2} ${number3}`;
}

function generateLicenseNumber(index: number): string {
  return `LIC-${String(index + 1).padStart(4, '0')}-2024`;
}

async function seed100Riders() {
  console.log('🏍️  Starting seed for 100 riders...');

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

    // Hash password once (same for all riders for testing)
    const hashedPassword = await bcrypt.hash('password', 12);

    // Distribution of vehicle types
    const vehicleDistribution = [
      ...Array(50).fill(VehicleType.MOTORCYCLE),  // 50 motorcycles
      ...Array(30).fill(VehicleType.CAR),         // 30 cars
      ...Array(10).fill(VehicleType.BICYCLE),     // 10 bicycles
      ...Array(10).fill(VehicleType.SCOOTER),     // 10 scooters
    ];

    // Shuffle the distribution
    for (let i = vehicleDistribution.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [vehicleDistribution[i], vehicleDistribution[j]] = [vehicleDistribution[j], vehicleDistribution[i]];
    }

    console.log('📊 Vehicle distribution:');
    console.log('   - Motorcycles: 50');
    console.log('   - Cars: 30');
    console.log('   - Bicycles: 10');
    console.log('   - Scooters: 10');
    console.log('');

    let created = 0;
    let skipped = 0;

    for (let i = 0; i < 100; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const fullName = `${firstName} ${lastName}`;
      const username = `rider${String(i + 1).padStart(3, '0')}`;
      const email = `${username}@vuala.com`;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        skipped++;
        continue;
      }

      const vehicleType = vehicleDistribution[i];
      const vehicle = getRandomVehicle(vehicleType);
      const area = getRandomElement(almeriaAreas);
      
      // Add some randomness to location
      const lat = area.lat + (Math.random() - 0.5) * 0.02;
      const lng = area.lng + (Math.random() - 0.5) * 0.02;

      // Random status distribution
      const statusRandom = Math.random();
      let status: RiderStatus;
      if (statusRandom < 0.7) {
        status = RiderStatus.IDLE;
      } else if (statusRandom < 0.9) {
        status = RiderStatus.ON_DELIVERY;
      } else {
        status = RiderStatus.OFFLINE;
      }

      // Create user and rider in transaction
      await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            username,
            name: fullName,
            email,
            password: hashedPassword,
            roleId: riderRole.id,
          },
        });

        // Create rider profile
        const rider = await tx.rider.create({
          data: {
            userId: user.id,
            phone: generatePhone(),
            licenseNumber: generateLicenseNumber(i),
            status,
            isActive: Math.random() > 0.1, // 90% active
            rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(2)), // 3.5 - 5.0
            completedOrders: getRandomInt(0, 500),
            vehicle: {
              create: {
                ...vehicle,
                licensePlate: generateLicensePlate(),
              },
            },
          },
        });

        // Create initial location
        await tx.riderLastLocation.create({
          data: {
            riderId: rider.id,
            lat,
            lng,
            speed: status === RiderStatus.ON_DELIVERY ? getRandomInt(5, 40) : 0,
            heading: getRandomInt(0, 360),
            accuracy: getRandomInt(5, 20),
            battery: getRandomInt(20, 100),
            source: getRandomElement(['android', 'ios']),
            timestamp: new Date(),
          },
        });

        // Create some location history (5-10 points)
        const historyPoints = getRandomInt(5, 10);
        const now = new Date();
        
        for (let h = 0; h < historyPoints; h++) {
          const minutesAgo = h * getRandomInt(2, 5);
          const timestamp = new Date(now.getTime() - minutesAgo * 60 * 1000);
          
          await tx.riderLocation.create({
            data: {
              riderId: rider.id,
              lat: lat + (Math.random() - 0.5) * 0.01,
              lng: lng + (Math.random() - 0.5) * 0.01,
              speed: status === RiderStatus.ON_DELIVERY ? getRandomInt(0, 50) : 0,
              heading: getRandomInt(0, 360),
              accuracy: getRandomInt(5, 25),
              timestamp,
            },
          });
        }
      });

      created++;

      // Progress indicator
      if ((created) % 10 === 0) {
        console.log(`   ✅ Created ${created} riders...`);
      }
    }

    console.log('');
    console.log('✅ Seed completed successfully!');
    console.log(`   📊 Total created: ${created}`);
    console.log(`   ⚠️  Skipped (already exist): ${skipped}`);
    console.log('');
    console.log('🔐 All riders have the same password for testing: "password"');
    console.log('📧 Email format: rider001@vuala.com, rider002@vuala.com, etc.');
    console.log('');
    console.log('📍 Riders distributed across Almería areas:');
    almeriaAreas.forEach(area => {
      console.log(`   - ${area.name}`);
    });

  } catch (error) {
    console.error('❌ Error seeding riders:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed100Riders()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
