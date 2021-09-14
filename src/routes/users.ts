import { Server } from '@hapi/hapi';
import { isRequestedUserOrAdmin, isAdmin, authStrategy } from '../helpers/auth';
import {
  getAuthenticatedUser,
  getUsersHandler,
  getUserHandler,
  createUserHandler,
  deleteUserHandler,
  updateUserHandler,
} from '../handlers/users';
import { failActionHandler } from '../handlers/fail';
import { createUserValidator, updateUserValidator } from '../validators/users';
import { userIdValidator } from '../validators/users';

const routes = async (server: Server) => {
  server.route([
    {
      method: 'GET',
      path: '/profile',
      handler: getAuthenticatedUser,
      options: {
        auth: authStrategy,
      },
    },
    {
      method: 'GET',
      path: '/users',
      handler: getUsersHandler,
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
      path: '/users/{userId}',
      handler: getUserHandler,
      options: {
        pre: [isRequestedUserOrAdmin],
        auth: authStrategy,
        validate: {
          params: userIdValidator,
          failAction: failActionHandler,
        },
      },
    },
    {
      method: 'POST',
      path: '/users',
      handler: createUserHandler,
      options: {
        pre: [isAdmin],
        auth: authStrategy,
        validate: {
          payload: createUserValidator,
          failAction: failActionHandler,
        },
      },
    },
    {
      method: 'DELETE',
      path: '/users/{userId}',
      handler: deleteUserHandler,
      options: {
        pre: [isRequestedUserOrAdmin],
        auth: authStrategy,
        validate: {
          params: userIdValidator,
          failAction: failActionHandler,
        },
      },
    },
    {
      method: 'PUT',
      path: '/users/{userId}',
      handler: updateUserHandler,
      options: {
        pre: [isRequestedUserOrAdmin],
        auth: authStrategy,
        validate: {
          params: userIdValidator,
          payload: updateUserValidator,
          failAction: failActionHandler,
        },
      },
    },
  ]);
};

export default routes;
