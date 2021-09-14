import Boom from '@hapi/boom';
import { Request, ResponseToolkit, AuthMode } from '@hapi/hapi';
import { API_AUTH_STRATEGY } from '../types/auth';

// Pre function to check if the authenticated user matches the requested user
export const isRequestedUserOrAdmin = async (request: Request, h: ResponseToolkit) => {
  const { userId, isAdmin } = request.auth.credentials;

  if (isAdmin) {
    // If the user is an admin allow
    return h.continue;
  }

  const requestedUserId = parseInt(request.params.userId, 10);
  if (requestedUserId === userId) {
    return h.continue;
  }

  // The authenticated user is not authorized
  throw Boom.forbidden();
};

// Pre function to check if the authenticated user matches the requested user
export const isAdmin = async (request: Request, h: ResponseToolkit) => {
  if (request.auth.credentials.isAdmin) {
    // If the user is an admin allow
    return h.continue;
  }

  // The authenticated user is not an admin
  throw Boom.forbidden();
};

export const authStrategy = {
  mode: 'required' as AuthMode,
  strategy: API_AUTH_STRATEGY,
};
