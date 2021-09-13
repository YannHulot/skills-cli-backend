import { PrismaClient } from '@prisma/client';
import { add, sub } from 'date-fns';

// Instantiate Prisma Client
const prisma = new PrismaClient();

// A `main` function so that we can use async/await
async function main() {
  await prisma.token.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.job.deleteMany({});

  const oneYearAgo = add(new Date(), { years: 1 });
  const twoYearsAgo = sub(new Date(), { years: 2 });

  await prisma.user.create({
    data: {
      email: 'yann.developer@gmail.com',
      firstName: 'Yann',
      lastName: 'Hulot',
      isAdmin: true,
      jobs: {
        create: [
          {
            startDate: twoYearsAgo,
            endDate: oneYearAgo,
            companyName: 'Apple',
            title: 'Software Engineer II',
            description: 'Fixing bugs and working on MacOS',
            stack: ['Swift', 'TS', 'React'],
          },
        ],
      },
    },
    include: {
      jobs: true,
    },
  });
}

main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  });
