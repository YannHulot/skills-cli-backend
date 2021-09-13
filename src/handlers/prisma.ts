import { PrismaClient } from '@prisma/client';
import Hapi from '@hapi/hapi';

export const prismaHandler = async (server: Hapi.Server) => {
  const prisma = new PrismaClient({
    log: ['error'],
  });

  server.app.prisma = prisma;

  // Close DB connection after the server's connection listeners are stopped
  // Related issue: https://github.com/hapijs/hapi/issues/2839
  server.ext({
    type: 'onPostStop',
    method: async (server: Hapi.Server) => {
      server.app.prisma.$disconnect();
    },
  });
};
