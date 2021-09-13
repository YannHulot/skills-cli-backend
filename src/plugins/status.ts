import Hapi from '@hapi/hapi';
import { statusHandler } from '../handlers/status';

const plugin: Hapi.Plugin<undefined> = {
  name: 'app/status',
  register: statusHandler,
};

export default plugin;
