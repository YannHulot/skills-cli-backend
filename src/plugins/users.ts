import Hapi from '@hapi/hapi';
import Joi from 'joi';
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

const userInputValidator = Joi.object({
  firstName: Joi.string().alter({
    create: (schema) => schema.required(),
    update: (schema) => schema.optional(),
  }),
  lastName: Joi.string().alter({
    create: (schema) => schema.required(),
    update: (schema) => schema.optional(),
  }),
  email: Joi.string()
    .email()
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
});

const createUserValidator = userInputValidator.tailor('create');
const updateUserValidator = userInputValidator.tailor('update');

const usersPlugin = {
  name: 'app/users',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
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
            params: Joi.object({
              userId: Joi.number().integer(),
            }),
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
            params: Joi.object({
              userId: Joi.number().integer(),
            }),
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
            params: Joi.object({
              userId: Joi.number().integer(),
            }),
            payload: updateUserValidator,
            failAction: (_request, _h, err) => {
              // show validation errors to user https://github.com/hapijs/hapi/issues/3706
              throw err;
            },
          },
        },
      },
    ]);
  },
};

export default usersPlugin;
