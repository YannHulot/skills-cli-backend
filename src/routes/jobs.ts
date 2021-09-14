import { Server } from '@hapi/hapi';
import { getAuthenticatedUserJobs } from '../handlers/jobs';
import { authStrategy } from '../helpers/auth';

const routes = async (server: Server) => {
  server.route([
    {
      method: 'GET',
      path: '/jobs',
      handler: getAuthenticatedUserJobs,
      options: {
        auth: authStrategy,
      },
    },
  ]);
};

export default routes;
