import { createUser, updateUser } from '../users';
import { prismaMock } from '../singleton';
import { Role } from '../types/helpers';

test('should create new user ', async () => {
  const user = {
    id: 1,
    firstName: 'Richie',
    email: 'hello@prisma.io',
    lastName: 'Rich',
    createdAt: new Date('10/12/2015'),
    role: Role.USER,
  };

  prismaMock.user.create.mockResolvedValue(user);

  await expect(createUser(user)).resolves.toEqual(user);
});

test('should update a user', async () => {
  const user = {
    id: 1,
    createdAt: new Date('10/12/2015'),
    firstName: 'Bob',
    email: 'hello@prisma.io',
    lastName: 'Rich',
    role: Role.USER,
  };

  const oldUser = {
    id: 1,
    firstName: 'Richie',
    email: 'hello@prisma.io',
    lastName: 'Rich',
    createdAt: new Date('10/12/2015'),
    role: Role.USER,
  };

  prismaMock.user.findFirst.mockResolvedValue(oldUser);
  prismaMock.user.update.mockResolvedValue(user);

  await expect(updateUser(user)).resolves.toEqual(user);
});

test('should NOT update a user', async () => {
  const user = {
    id: 1,
    createdAt: new Date('10/12/2015'),
    firstName: 'Bob',
    email: 'hello@prisma.io',
    lastName: 'Rich',
    role: Role.USER,
  };

  prismaMock.user.findFirst.mockResolvedValue(null);

  await expect(updateUser(user)).resolves.toEqual(new Error('user does not exist'));
});
