import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial demo user...');

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@foodsystem.test' },
    update: {},
    create: {
      email: 'demo@foodsystem.test',
      name: 'Demo User',
      subscriptionStatus: 'INACTIVE',
    },
  });

  console.log(`✅ Demo user seeded with ID: ${demoUser.id} (${demoUser.email})`);

  const count = await prisma.searchHistory.count({
    where: { userId: demoUser.id },
  });

  if (count === 0) {
    await prisma.searchHistory.createMany({
      data: [
        {
          userId: demoUser.id,
          query: 'Nutella',
          language: 'en',
          resultCount: 24,
        },
        {
          userId: demoUser.id,
          query: 'Hafermilch',
          language: 'de',
          resultCount: 18,
        },
        {
          userId: demoUser.id,
          query: 'Croissant',
          language: 'fr',
          resultCount: 15,
        },
      ],
    });
    console.log('✅ Seeded sample search history items.');
  }
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
