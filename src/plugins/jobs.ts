import { Plugin } from '@hapi/hapi';
import routes from '../routes/jobs';

const plugin: Plugin<null> = {
  name: 'app/jobs',
  dependencies: ['prisma'],
  register: routes,
};

export default plugin;
