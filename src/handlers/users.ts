import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { UserInput } from '../types/users';

export const getUsersHandler = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    return h.response(users).code(200);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to get users');
  }
};

export const getAuthenticatedUser = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;
  const { userId } = request.auth.credentials;

  try {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
      where: {
        id: userId,
      },
    });

    if (!user) {
      return h.response().code(404);
    } else {
      return h.response(user).code(200);
    }
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation();
  }
};

export const getUserHandler = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;
  const userId = parseInt(request.params.userId, 10);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return Boom.notFound();
    } else {
      return h.response(user).code(200);
    }
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to get user');
  }
};

export const createUserHandler = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;
  const payload = request.payload as UserInput;

  try {
    const createdUser = await prisma.user.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    return h.response(createdUser).code(201);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to create user');
  }
};

export const deleteUserHandler = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;
  const userId = parseInt(request.params.userId, 10);

  try {
    // Delete all enrollments
    await prisma.$transaction([
      prisma.token.deleteMany({
        where: {
          userId: userId,
        },
      }),
      prisma.user.delete({
        where: {
          id: userId,
        },
      }),
    ]);

    return h.response().code(204);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to delete user');
  }
};

export const updateUserHandler = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;
  const userId = parseInt(request.params.userId, 10);
  const payload = request.payload as Partial<UserInput>;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: payload,
    });
    return h.response(updatedUser).code(200);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to update user');
  }
};
