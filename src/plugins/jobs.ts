import { Plugin } from '@hapi/hapi';
import routes from '../routes/jobs';

const jobsPlugin: Plugin<null> = {
  name: 'app/jobs',
  dependencies: ['prisma'],
  register: routes,
};

export default jobsPlugin;
