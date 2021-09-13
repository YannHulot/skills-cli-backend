import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { API_AUTH_STRATEGY, JWT_ALGORITHM, JWT_SECRET } from '../types/auth';
import { validateAPIToken, loginHandler, authenticateHandler } from '../handlers/auth';

declare module '@hapi/hapi' {
  interface AuthCredentials {
    userId: number;
    tokenId: number;
    isAdmin: boolean;
  }
}

const authPlugin: Hapi.Plugin<null> = {
  name: 'app/auth',
  dependencies: ['prisma', 'hapi-auth-jwt2', 'app/email'],
  register: async function (server: Hapi.Server) {
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
            failAction: (_request, _h, err) => {
              // show validation errors to user https://github.com/hapijs/hapi/issues/3706
              throw err;
            },
            payload: Joi.object({
              email: Joi.string().email().required(),
            }),
          },
        },
      },
      {
        // Endpoint to authenticate the magiclink and to generate a long lived token
        method: 'POST',
        path: '/authenticate',
        handler: authenticateHandler,
        options: {
          auth: false,
          validate: {
            payload: Joi.object({
              email: Joi.string().email().required(),
              emailToken: Joi.string().required(),
            }),
          },
        },
      },
    ]);
  },
};

export default authPlugin;
