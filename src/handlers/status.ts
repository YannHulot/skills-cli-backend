import Hapi from '@hapi/hapi';

export const statusHandler = async (server: Hapi.Server) => {
  server.route({
    // default status endpoint
    method: 'GET',
    path: '/',
    handler: (_, h: Hapi.ResponseToolkit) => h.response({ up: true }).code(200),
    options: {
      auth: false,
    },
  });
};
