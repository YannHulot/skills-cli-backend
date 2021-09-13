import { Plugin } from '@hapi/hapi';
import routes from '../routes/status';

const statusPlugin: Plugin<null> = {
  name: 'app/status',
  register: routes,
};

export default statusPlugin;
