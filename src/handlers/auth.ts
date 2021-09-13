import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { TokenType } from '@prisma/client';
import { add } from 'date-fns';
import {
  APITokenPayload,
  EMAIL_TOKEN_EXPIRATION_MINUTES,
  LoginInput,
  AuthenticateInput,
  AUTHENTICATION_TOKEN_EXPIRATION_HOURS,
} from '../types/auth';
import { generateAuthToken, generateEmailToken } from '../helpers/jwt';
import { apiTokenSchema } from '../validators/auth';

// Function will be called on every request using the auth strategy
export const validateAPIToken = async (decoded: APITokenPayload, request: Hapi.Request) => {
  const { prisma } = request.server.app;
  const { tokenId } = decoded;
  const { error } = apiTokenSchema.validate(decoded);

  if (error) {
    request.log(['error', 'auth'], `API token error: ${error.message}`);
    return { isValid: false };
  }

  try {
    // Fetch the token from DB to verify it's valid
    const fetchedToken = await prisma.token.findUnique({
      where: {
        id: tokenId,
      },
      include: {
        user: true,
      },
    });

    // Check if token could be found in database and is valid
    if (!fetchedToken || !fetchedToken?.valid) {
      return { isValid: false, errorMessage: 'Invalid token' };
    }

    // Check token expiration
    if (fetchedToken.expiration < new Date()) {
      return { isValid: false, errorMessage: 'Token expired' };
    }

    // The token is valid. Pass the token payload (in `decoded`), userId, and isAdmin to `credentials`
    // which is available in route handlers via request.auth.credentials
    return {
      isValid: true,
      credentials: {
        tokenId: decoded.tokenId,
        userId: fetchedToken.userId,
        isAdmin: fetchedToken.user.isAdmin,
      },
    };
  } catch (error) {
    request.log(['error', 'auth', 'db'], error);
    return { isValid: false, errorMessage: 'DB Error' };
  }
};

/**
 * Login/Registration handler
 *
 * Because there are no passwords, the same endpoint is used for login and registration
 * Generates a short lived verification token and sends an email
 */
export const loginHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  // 👇 get prisma and the sendEmailToken from shared application state
  const { prisma, sendEmailToken } = request.server.app;
  // 👇 get the email from the request payload
  const { email } = request.payload as LoginInput;
  // 👇 generate an alphanumeric token
  const emailToken = generateEmailToken();
  // 👇 create a date object for the email token expiration
  const tokenExpiration = add(new Date(), {
    minutes: EMAIL_TOKEN_EXPIRATION_MINUTES,
  });

  try {
    // 👇 create a short lived token and update user or create if they don't exist
    await prisma.token.create({
      data: {
        emailToken,
        type: TokenType.EMAIL,
        expiration: tokenExpiration,
        user: {
          connectOrCreate: {
            create: {
              email,
              firstName: 'auth-firstName-automated',
              lastName: 'auth-lastName-automated',
            },
            where: {
              email,
            },
          },
        },
      },
    });

    // if we dont have a sendgrid key, we just return the token as part of the response payload
    // for easier and faster testing purposes
    if (!process.env.SENDGRID_API_KEY) {
      return h.response({ emailToken }).code(200);
    } else {
      await sendEmailToken(email, emailToken);
    }
  } catch (error) {
    return Boom.badImplementation(error.message);
  }
};

export const authenticateHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  // 👇 get prisma from shared application state
  const { prisma } = request.server.app;
  // 👇 get the email and emailToken from the request payload
  const { email, emailToken } = request.payload as AuthenticateInput;

  try {
    // Get short lived email token
    const fetchedEmailToken = await prisma.token.findUnique({
      where: {
        emailToken: emailToken,
      },
      include: {
        user: true,
      },
    });

    if (!fetchedEmailToken?.valid) {
      // If the token doesn't exist or is not valid, return 401 unauthorized
      return Boom.unauthorized();
    }

    if (fetchedEmailToken.expiration < new Date()) {
      // If the token has expired, return 401 unauthorized
      return Boom.unauthorized('Token expired');
    }

    // If token matches the user email passed in the payload, generate long lived API token
    if (fetchedEmailToken?.user?.email === email) {
      const tokenExpiration = add(new Date(), {
        hours: AUTHENTICATION_TOKEN_EXPIRATION_HOURS,
      });
      // Persist token in DB so it's stateful
      const createdToken = await prisma.token.create({
        data: {
          type: TokenType.API,
          expiration: tokenExpiration,
          user: {
            connect: {
              email,
            },
          },
        },
      });

      // Invalidate the email token after it's been used
      await prisma.token.update({
        where: {
          id: fetchedEmailToken.id,
        },
        data: {
          valid: false,
        },
      });

      const authToken = generateAuthToken(createdToken.id);
      return h.response().code(200).header('Authorization', authToken);
    } else {
      return Boom.unauthorized();
    }
  } catch (error) {
    return Boom.badImplementation(error.message);
  }
};
