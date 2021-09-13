import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';

// Pre function to check if the authenticated user matches the requested user
export const isRequestedUserOrAdmin = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
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
export const isAdmin = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  if (request.auth.credentials.isAdmin) {
    // If the user is an admin allow
    return h.continue;
  }

  // The authenticated user is not an admin
  throw Boom.forbidden();
};