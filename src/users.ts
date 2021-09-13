import prisma from './client';
import { IncomingNewUser, IncomingUpdateUser } from './types/incoming';

export const createUser = async (user: IncomingNewUser) => {
  return await prisma.user.create({
    data: user,
  });
};

export const updateUser = async (user: IncomingUpdateUser) => {
  const existingUser = await prisma.user.findFirst({ where: { id: user.id } });

  if (!existingUser) {
    return new Error('user does not exist');
  }

  console.log('should not come here');
  return await prisma.user.update({
    where: { id: user.id },
    data: user,
  });
};
