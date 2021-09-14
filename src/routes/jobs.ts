import { Server } from '@hapi/hapi';
import {
  getAuthenticatedUserJobs,
  getAllJobsHandler,
  getJobHandler,
  createJobHandler,
  deleteJobHandler,
  deleteJobsHandler,
  updateJobHandler,
} from '../handlers/jobs';
import { authStrategy, isAdmin, isRequestedUserOrAdmin, isUserOwnerOfJobOrAdmin } from '../helpers/auth';
import { failActionHandler } from '../handlers/fail';
import { jobIdValidator, createJobValidator, updateJobValidator } from '../validators/jobs';

const routes = async (server: Server) => {
  server.route([
    {
      method: 'GET',
      path: '/history',
      handler: getAuthenticatedUserJobs,
      options: {
        auth: authStrategy,
      },
    },
    {
      method: 'GET',
      path: '/jobs',
      handler: getAllJobsHandler,
      options: {
        pre: [isAdmin],
        auth: authStrategy,
        validate: {
          failAction: failActionHandler,
        },
      },
    },
    {
      method: 'GET',
      path: '/jobs/{jobId}',
      handler: getJobHandler,
      options: {
        pre: [isRequestedUserOrAdmin],
        auth: authStrategy,
        validate: {
          params: jobIdValidator,
          failAction: failActionHandler,
        },
      },
    },
    {
      method: 'POST',
      path: '/jobs',
      handler: createJobHandler,
      options: {
        pre: [isRequestedUserOrAdmin],
        auth: authStrategy,
        validate: {
          payload: createJobValidator,
          failAction: failActionHandler,
        },
      },
    },
    {
      method: 'DELETE',
      path: '/jobs/{jobId}',
      handler: deleteJobHandler,
      options: {
        pre: [isUserOwnerOfJobOrAdmin],
        auth: authStrategy,
        validate: {
          params: jobIdValidator,
          failAction: failActionHandler,
        },
      },
    },
    {
      method: 'DELETE',
      path: '/jobs',
      handler: deleteJobsHandler,
      options: {
        pre: [isRequestedUserOrAdmin],
        auth: authStrategy,
      },
    },
    {
      method: 'PUT',
      path: '/jobs/{jobId}',
      handler: updateJobHandler,
      options: {
        pre: [isUserOwnerOfJobOrAdmin],
        auth: authStrategy,
        validate: {
          params: jobIdValidator,
          payload: updateJobValidator,
          failAction: failActionHandler,
        },
      },
    },
  ]);
};

export default routes;
