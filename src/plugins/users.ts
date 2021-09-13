import { Plugin } from '@hapi/hapi';
import userRoutes from '../routes/users';

const usersPlugin: Plugin<null> = {
  name: 'app/users',
  dependencies: ['prisma'],
  register: userRoutes,
};

export default usersPlugin;
