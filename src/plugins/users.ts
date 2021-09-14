import { Plugin } from '@hapi/hapi';
import routes from '../routes/users';

const plugin: Plugin<null> = {
  name: 'app/users',
  dependencies: ['prisma'],
  register: routes,
};

export default plugin;
