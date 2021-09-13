import { PrismaClient } from '@prisma/client';
import { Plugin } from '@hapi/hapi';
import { prismaHandler } from '../handlers/prisma';

// Module augmentation to add shared application state
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33809#issuecomment-472103564
declare module '@hapi/hapi' {
  interface ServerApplicationState {
    prisma: PrismaClient;
  }
}

// plugin to instantiate Prisma Client
const prismaPlugin: Plugin<null> = {
  name: 'prisma',
  register: prismaHandler,
};

export default prismaPlugin;
