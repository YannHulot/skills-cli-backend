import { Plugin } from '@hapi/hapi';
import routes from '../routes/auth';

declare module '@hapi/hapi' {
  interface AuthCredentials {
    userId: number;
    tokenId: number;
    isAdmin: boolean;
  }
}

const plugin: Plugin<null> = {
  name: 'app/auth',
  dependencies: ['prisma', 'hapi-auth-jwt2', 'app/email'],
  register: routes,
};

export default plugin;
