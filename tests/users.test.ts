import { createServer } from '../src/server';
import Hapi, { AuthCredentials } from '@hapi/hapi';
import { createUserCredentials } from './helpers/users';
import { API_AUTH_STRATEGY } from '../src/types/auth';

describe('users endpoints', () => {
  let server: Hapi.Server;
  let testUserCredentials: AuthCredentials;
  let testAdminCredentials: AuthCredentials;

  beforeAll(async () => {
    server = await createServer();
    // Create a test user and admin and get the credentials object for them
    testUserCredentials = await createUserCredentials(server.app.prisma, false);
    testAdminCredentials = await createUserCredentials(server.app.prisma, true);
  });

  afterAll(async () => {
    await server.stop();
  });

  let userId: number;

  test('profile', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/profile',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: testUserCredentials,
      },
    });

    expect(response.statusCode).toEqual(200);

    const fetchedUserId = JSON.parse(response.payload)?.id as number;
    expect(fetchedUserId).toEqual(testUserCredentials.userId);
  });

  test('create user', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: testAdminCredentials,
      },
      payload: {
        firstName: 'test-first-name',
        lastName: 'test-last-name',
        email: `test-${Date.now()}@prisma.io`,
      },
    });

    expect(response.statusCode).toEqual(201);

    userId = JSON.parse(response.payload)?.id;
    expect(typeof userId === 'number').toBeTruthy();
  });

  test('create user validation', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: testAdminCredentials,
      },
      payload: {
        lastName: 'test-last-name',
        email: `test-${Date.now()}@prisma.io`,
      },
    });

    expect(response.statusCode).toEqual(400);
  });

  test('get user returns 404 for non existent user', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/users/9999',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: testAdminCredentials,
      },
    });

    expect(response.statusCode).toEqual(404);
  });

  test('get users returns array of users', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/users`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: testAdminCredentials,
      },
    });
    expect(response.statusCode).toEqual(200);
    const users = JSON.parse(response.payload);

    expect(Array.isArray(users)).toBeTruthy();
    expect(users[0]?.id).toBeTruthy();
  });

  test('get user returns user', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/users/${testUserCredentials.userId}`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: testUserCredentials,
      },
    });
    expect(response.statusCode).toEqual(200);
    const user = JSON.parse(response.payload);

    expect(user.id).toBe(testUserCredentials.userId);
  });

  test('get user fails with invalid id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/users/a123',
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: testUserCredentials,
      },
    });
    expect(response.statusCode).toEqual(400);
  });

  test('update user fails with invalid userId parameter', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: `/users/aa22`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: testUserCredentials,
      },
    });
    expect(response.statusCode).toEqual(400);
  });

  test('update user - authenticated user updates his profile', async () => {
    const updatedFirstName = 'test-first-name-UPDATED';
    const updatedLastName = 'test-last-name-UPDATED';

    const response = await server.inject({
      method: 'PUT',
      url: `/users/${testUserCredentials.userId}`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: testUserCredentials,
      },
      payload: {
        firstName: updatedFirstName,
        lastName: updatedLastName,
      },
    });
    expect(response.statusCode).toEqual(200);
    const user = JSON.parse(response.payload);
    expect(user.firstName).toEqual(updatedFirstName);
    expect(user.lastName).toEqual(updatedLastName);
  });

  test('delete user fails with invalid userId parameter', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/aa22`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: testUserCredentials,
      },
    });
    expect(response.statusCode).toEqual(400);
  });

  test('delete authenticated user', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/${testUserCredentials.userId}`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: testUserCredentials,
      },
    });
    expect(response.statusCode).toEqual(204);
  });

  test('delete user as an admin', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/${userId}`,
      auth: {
        strategy: API_AUTH_STRATEGY,
        credentials: testAdminCredentials,
      },
    });
    expect(response.statusCode).toEqual(204);
  });
});
