import { Plugin } from '@hapi/hapi';
import routes from '../routes/status';

const plugin: Plugin<null> = {
  name: 'app/status',
  register: routes,
};

export default plugin;
