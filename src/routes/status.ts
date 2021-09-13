import { Server } from '@hapi/hapi';
import { statusHandler } from '../handlers/status';

const routes = async (server: Server) => {
  server.route({
    method: 'GET',
    path: '/',
    handler: statusHandler,
    options: {
      auth: false,
    },
  });
};

export default routes;
