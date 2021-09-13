import { Plugin } from '@hapi/hapi';
import routes from '../routes/users';

const usersPlugin: Plugin<null> = {
  name: 'app/users',
  dependencies: ['prisma'],
  register: routes,
};

export default usersPlugin;
