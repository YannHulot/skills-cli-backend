import Joi from 'joi';

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

export const createUserValidator = userInputValidator.tailor('create');

export const updateUserValidator = userInputValidator.tailor('update');

export const userIdValidator = Joi.object({
  userId: Joi.number().integer(),
});
