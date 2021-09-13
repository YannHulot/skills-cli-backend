import { PrismaClient } from '@prisma/client';
import Fastify, { FastifyInstance } from 'fastify';
import jwtVerifier from './jwtVerifier';
import { IncomingNewUser } from './types/incoming';

const prisma = new PrismaClient();
const server: FastifyInstance = Fastify({ logger: true });

server.route({
  method: 'GET',
  url: '/users',
  preHandler: async (request, reply) => {
    return jwtVerifier(request, reply);
  },
  handler: async () => {
    const users = await prisma.user.findMany();
    return { success: true, payload: users };
  },
});

server.route<{ Body: IncomingNewUser }>({
  method: 'POST',
  url: '/new',
  schema: {
    body: {
      email: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
    },
  },
  preHandler: async (request, reply) => {
    return jwtVerifier(request, reply);
  },
  handler: async (request) => {
    const { firstName, lastName, email } = request.body;
    const user = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName,
        email,
      },
    });
    return { success: true, payload: user };
  },
});

const start = async () => {
  try {
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
