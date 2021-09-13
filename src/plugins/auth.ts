import { Plugin } from '@hapi/hapi';
import authRoutes from '../routes/auth';

declare module '@hapi/hapi' {
  interface AuthCredentials {
    userId: number;
    tokenId: number;
    isAdmin: boolean;
  }
}

const authPlugin: Plugin<null> = {
  name: 'app/auth',
  dependencies: ['prisma', 'hapi-auth-jwt2', 'app/email'],
  register: authRoutes,
};

export default authPlugin;
