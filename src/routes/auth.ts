import { Server } from '@hapi/hapi';
import { API_AUTH_STRATEGY, JWT_ALGORITHM, JWT_SECRET } from '../types/auth';
import { validateAPIToken, loginHandler, authenticateHandler } from '../handlers/auth';
import { emailValidator, emailAndTokenValidator } from '../validators/auth';
import { failActionHandler } from '../handlers/fail';

const routes = async (server: Server) => {
  if (!process.env.JWT_SECRET) {
    server.log('warn', 'The JWT_SECRET env var is not set. This is unsafe! If running in production, set it.');
  }

  server.auth.strategy(API_AUTH_STRATEGY, 'jwt', {
    key: JWT_SECRET,
    verifyOptions: { algorithms: [JWT_ALGORITHM] },
    validate: validateAPIToken,
  });

  // Require by default API token unless otherwise configured
  server.auth.default(API_AUTH_STRATEGY);

  server.route([
    // Endpoint to login or register and to send the short lived token
    {
      method: 'POST',
      path: '/login',
      handler: loginHandler,
      options: {
        auth: false,
        validate: {
          failAction: failActionHandler,
          payload: emailValidator,
        },
      },
    },
    {
      // Endpoint to authenticate the short lived token and to generate a long lived token
      method: 'POST',
      path: '/authenticate',
      handler: authenticateHandler,
      options: {
        auth: false,
        validate: {
          payload: emailAndTokenValidator,
          failAction: failActionHandler,
        },
      },
    },
  ]);
};

export default routes;
