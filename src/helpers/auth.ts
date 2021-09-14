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

// Pre function to check if user is the owner of the job of a job and can modify it
export const isUserOwnerOfJobOrAdmin = async (request: Request, h: ResponseToolkit) => {
  const { isAdmin, currentJobs } = request.auth.credentials;
  const jobId = parseInt(request.params.jobId, 10);

  if (isAdmin) {
    // If the user is an admin allow
    return h.continue;
  }

  if (currentJobs?.includes(jobId)) {
    return h.continue;
  }
  // If the user is not the owner of the job, deny access
  throw Boom.forbidden();
};

export const authStrategy = {
  mode: 'required' as AuthMode,
  strategy: API_AUTH_STRATEGY,
};
