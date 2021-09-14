import { PrismaClient } from '@prisma/client';
import { add, sub } from 'date-fns';

// Instantiate Prisma Client
const prisma = new PrismaClient();

// A `main` function so that we can use async/await
const main = async () => {
  await prisma.token.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.job.deleteMany({});

  const oneYearAgo = add(new Date(), { years: 1 });
  const tenYearsAgo = sub(new Date(), { years: 10 });

  await prisma.user.create({
    data: {
      email: 'steve.jobs@apple.com',
      firstName: 'Steve',
      lastName: 'Jobs',
      isAdmin: true,
      jobs: {
        create: [
          {
            startDate: tenYearsAgo,
            endDate: oneYearAgo,
            companyName: 'Apple',
            title: 'CEO',
            description: 'Save Apple from bankruptcy. Develop the IPad, the IPOD and build a trillion $ company',
            stack: ['Swift', 'MacOS', 'IPadOS'],
          },
        ],
      },
    },
    include: {
      jobs: true,
    },
  });
};

main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  });
