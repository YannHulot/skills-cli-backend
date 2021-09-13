import { PrismaClient } from '@prisma/client'
import Fastify, { FastifyInstance } from 'fastify'
import jwtVerifier from './jwtVerifier'

const prisma = new PrismaClient()

const server: FastifyInstance = Fastify({ logger: true })

server.route({
  method: "GET",
  url: "/users",
  preHandler: async (request, reply) => {
    return jwtVerifier(request, reply);
  },
  handler: async () => {
    const users = await prisma.user.findMany()
    return { success: true, payload: users }
  }
});

const start = async () => {
  try {
    await server.listen(3000)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()

