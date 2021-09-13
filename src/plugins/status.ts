import { Plugin } from '@hapi/hapi';
import statusRoutes from '../routes/status';

const statusPlugin: Plugin<null> = {
  name: 'app/status',
  register: statusRoutes,
};

export default statusPlugin;
