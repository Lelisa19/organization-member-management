import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'SuperAdmin',
    },
  });

  await prisma.user.upsert({
    where: { email: 'organ@example.com' },
    update: {},
    create: {
      name: 'Org Admin',
      email: 'organ@example.com',
      password: hashedPassword,
      role: 'organAdmin',
      organization_name: 'Tech Corp',
      organization_type: 'business',
    },
  });

  console.log('Test users created:');
  console.log('SuperAdmin: admin@example.com / password123');
  console.log('OrganAdmin: organ@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
