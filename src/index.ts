import { PrismaClient } from '@prisma/client';
import Fastify, { FastifyInstance } from 'fastify';
import jwtVerifier from './utils/jwtVerifier';
import { IncomingNewUser, IncomingUpdateUser } from './types/incoming';
import { createUser, updateUser } from './users';

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
    const user = await createUser(request.body);
    return { success: true, payload: user };
  },
});

server.route<{ Body: IncomingUpdateUser }>({
  method: 'PUT',
  url: '/update',
  schema: {
    body: {
      id: { type: 'number' },
      email: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
    },
  },
  preHandler: async (request, reply) => {
    return jwtVerifier(request, reply);
  },
  handler: async (request) => {
    const userOrError = await updateUser(request.body);
    if (userOrError instanceof Error) {
      return { success: false, error: userOrError.message };
    } else {
      return { success: false, payload: userOrError };
    }
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
