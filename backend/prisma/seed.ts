import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const plans = [
    {
      name: 'Basic',
      price: 10.0,
      billing_cycle: 'monthly',
      type: 'Standard',
      max_members: 10,
      duration_days: 30,
    },
    {
      name: 'Pro',
      price: 25.0,
      billing_cycle: 'monthly',
      type: 'Premium',
      max_members: 50,
      duration_days: 30,
    },
    {
      name: 'Enterprise',
      price: 100.0,
      billing_cycle: 'yearly',
      type: 'Elite',
      max_members: 500,
      duration_days: 365,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.create({
      data: plan,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
