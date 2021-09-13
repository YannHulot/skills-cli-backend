import { Server, ResponseToolkit } from '@hapi/hapi';

const statusRoutes = async (server: Server) => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (_, h: ResponseToolkit) => h.response({ up: true }).code(200),
    options: {
      auth: false,
    },
  });
};

export default statusRoutes;
