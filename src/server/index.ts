import Hapi, { Server } from '@hapi/hapi';
import hapiAuthJWT from 'hapi-auth-jwt2';
import prismaPlugin from '../plugins/prisma';
import emailPlugin from '../plugins/email';
import usersPlugin from '../plugins/users';
import statusPlugin from '../plugins/status';
import authPlugin from '../plugins/auth';
import jobsPlugin from '../plugins/jobs';
import dotenv from 'dotenv';
import hapiPino from 'hapi-pino';

dotenv.config();

const server: Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
});

export const createServer = async (): Promise<Server> => {
  // Register the logger
  await server.register({
    plugin: hapiPino,
    options: {
      logEvents: process.env.CI === 'true' || process.env.TEST === 'true' ? false : undefined,
      prettyPrint: process.env.NODE_ENV !== 'production',
      // Redact Authorization headers and emailtoken, see https://getpino.io/#/docs/redaction
      redact: ['req.headers.authorization', 'req.headers.emailtoken'],
    },
  });

  await server.register([hapiAuthJWT, authPlugin, prismaPlugin, emailPlugin, statusPlugin, usersPlugin, jobsPlugin]);
  await server.initialize();
  return server;
};

export const startServer = async (server: Server): Promise<Server> => {
  await server.start();
  server.log('info', `Server is running on ${server.info.uri}`);
  return server;
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
