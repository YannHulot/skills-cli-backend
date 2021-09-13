import { Server } from '@hapi/hapi';
import { API_AUTH_STRATEGY } from '../types/auth';
import { isRequestedUserOrAdmin, isAdmin } from '../helpers/auth';
import {
  getAuthenticatedUser,
  getUsersHandler,
  getUserHandler,
  createUserHandler,
  deleteUserHandler,
  updateUserHandler,
} from '../handlers/users';
import { createUserValidator, updateUserValidator } from '../validators/user';
import { userIdValidator } from '../validators/user';

const userRoutes = async (server: Server) => {
  server.route([
    {
      method: 'GET',
      path: '/profile',
      handler: getAuthenticatedUser,
      options: {
        auth: {
          mode: 'required',
          strategy: API_AUTH_STRATEGY,
        },
      },
    },
    {
      method: 'GET',
      path: '/users',
      handler: getUsersHandler,
      options: {
        pre: [isAdmin],
        auth: {
          mode: 'required',
          strategy: API_AUTH_STRATEGY,
        },
        validate: {
          failAction: (_request, _h, err) => {
            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
            throw err;
          },
        },
      },
    },
    {
      method: 'GET',
      path: '/users/{userId}',
      handler: getUserHandler,
      options: {
        pre: [isRequestedUserOrAdmin],
        auth: {
          mode: 'required',
          strategy: API_AUTH_STRATEGY,
        },
        validate: {
          params: userIdValidator,
          failAction: (_request, _h, err) => {
            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
            throw err;
          },
        },
      },
    },
    {
      method: 'POST',
      path: '/users',
      handler: createUserHandler,
      options: {
        pre: [isAdmin],
        auth: {
          mode: 'required',
          strategy: API_AUTH_STRATEGY,
        },
        validate: {
          payload: createUserValidator,
          failAction: (_request, _h, err) => {
            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
            throw err;
          },
        },
      },
    },
    {
      method: 'DELETE',
      path: '/users/{userId}',
      handler: deleteUserHandler,
      options: {
        pre: [isRequestedUserOrAdmin],
        auth: {
          mode: 'required',
          strategy: API_AUTH_STRATEGY,
        },
        validate: {
          params: userIdValidator,
          failAction: (_request, _h, err) => {
            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
            throw err;
          },
        },
      },
    },
    {
      method: 'PUT',
      path: '/users/{userId}',
      handler: updateUserHandler,
      options: {
        pre: [isRequestedUserOrAdmin],
        auth: {
          mode: 'required',
          strategy: API_AUTH_STRATEGY,
        },
        validate: {
          params: userIdValidator,
          payload: updateUserValidator,
          failAction: (_request, _h, err) => {
            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
            throw err;
          },
        },
      },
    },
  ]);
};

export default userRoutes;
