import Joi from 'joi';

export const emailValidator = Joi.object({
  email: Joi.string().email().required(),
});

export const emailAndTokenValidator = Joi.object({
  email: Joi.string().email().required(),
  emailToken: Joi.string().required(),
});

export const apiTokenSchema = Joi.object({
  tokenId: Joi.number().integer().required(),
});
