import app from './app';
import { config } from './config/env';
import prisma from './config/db';

const server = app.listen(config.port, async () => {
  console.log(`🚀 Food System Backend running at http://localhost:${config.port}`);
  console.log(`📡 Connected to database at: ${config.databaseUrl.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`🌐 Frontend origin allowed: ${config.frontendUrl}`);

  try {
    await prisma.$connect();
    console.log('✅ MySQL Database connected via Prisma successfully.');
  } catch (err: any) {
    console.error('❌ Could not connect to MySQL Database:', err.message);
  }
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
