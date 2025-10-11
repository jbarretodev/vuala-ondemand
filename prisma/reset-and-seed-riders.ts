import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetAndSeed() {
  console.log('🗑️  Deleting existing riders and related data...');

  try {
    // Delete in correct order due to foreign keys
    await prisma.riderLocation.deleteMany({});
    console.log('   ✅ Deleted rider locations');

    await prisma.riderLastLocation.deleteMany({});
    console.log('   ✅ Deleted rider last locations');

    await prisma.vehicle.deleteMany({});
    console.log('   ✅ Deleted vehicles');

    await prisma.rider.deleteMany({});
    console.log('   ✅ Deleted riders');

    // Delete rider users
    const riderRole = await prisma.role.findUnique({
      where: { name: 'rider' },
    });

    if (riderRole) {
      await prisma.user.deleteMany({
        where: { roleId: riderRole.id },
      });
      console.log('   ✅ Deleted rider users');
    }

    console.log('');
    console.log('✅ Cleanup completed!');
    console.log('');
    console.log('🏍️  Now run: pnpm run db:seed:100riders');
    console.log('');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetAndSeed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
