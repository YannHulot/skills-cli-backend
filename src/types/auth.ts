import Joi from 'joi';

export const API_AUTH_STRATEGY = 'API';
export const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_JWT_SECRET';
export const JWT_ALGORITHM = 'HS256';
export const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
export const AUTHENTICATION_TOKEN_EXPIRATION_HOURS = 12;

export const apiTokenSchema = Joi.object({
  tokenId: Joi.number().integer().required(),
});

export interface APITokenPayload {
  tokenId: number;
}

export interface LoginInput {
  email: string;
}

export interface AuthenticateInput {
  email: string;
  emailToken: string;
}
