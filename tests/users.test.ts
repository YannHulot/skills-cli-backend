import { createServer } from '../src/server';
import { AuthCredentials, Server, ServerInjectResponse } from '@hapi/hapi';
import { createUserCredentials } from './helpers/users';
import { API_AUTH_STRATEGY } from '../src/types/auth';

describe('users endpoints', () => {
  let server: Server;
  let testBasicCredentials: AuthCredentials;
  let testAdminCredentials: AuthCredentials;
  let userId: number;
  let response: ServerInjectResponse;

  beforeAll(async () => {
    server = await createServer();
    // Create a test user and admin and get the credentials object for them
    testBasicCredentials = await createUserCredentials(server.app.prisma, false);
    testAdminCredentials = await createUserCredentials(server.app.prisma, true);
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('as an admin', () => {
    test('create user', async () => {
      response = await server.inject({
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

    test('create user with validation', async () => {
      response = await server.inject({
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
      response = await server.inject({
        method: 'GET',
        url: '/users/9999',
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testAdminCredentials,
        },
      });

      expect(response.statusCode).toEqual(404);
    });

    test('get users returns all the users', async () => {
      response = await server.inject({
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

    test('delete a user', async () => {
      response = await server.inject({
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

  describe('as a basic user', () => {
    test('get user own profile', async () => {
      response = await server.inject({
        method: 'GET',
        url: '/profile',
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
      });

      expect(response.statusCode).toEqual(200);
      const fetchedUserId = JSON.parse(response.payload)?.id as number;
      expect(fetchedUserId).toEqual(testBasicCredentials.userId);
    });

    test('get user returns user', async () => {
      response = await server.inject({
        method: 'GET',
        url: `/users/${testBasicCredentials.userId}`,
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
      });

      expect(response.statusCode).toEqual(200);
      const user = JSON.parse(response.payload);
      expect(user.id).toBe(testBasicCredentials.userId);
    });

    test('get user fails with invalid userId parameter', async () => {
      response = await server.inject({
        method: 'GET',
        url: '/users/a123',
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
      });

      expect(response.statusCode).toEqual(400);
    });

    test('update account fails with invalid userId parameter', async () => {
      response = await server.inject({
        method: 'PUT',
        url: `/users/aa22`,
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
      });

      expect(response.statusCode).toEqual(400);
    });

    test('update own account', async () => {
      const updatedFirstName = 'test-first-name-UPDATED';
      const updatedLastName = 'test-last-name-UPDATED';

      response = await server.inject({
        method: 'PUT',
        url: `/users/${testBasicCredentials.userId}`,
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
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

    test('delete own account fails with invalid userId parameter', async () => {
      response = await server.inject({
        method: 'DELETE',
        url: `/users/aa22`,
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
      });

      expect(response.statusCode).toEqual(400);
    });

    test('delete own account', async () => {
      response = await server.inject({
        method: 'DELETE',
        url: `/users/${testBasicCredentials.userId}`,
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
      });

      expect(response.statusCode).toEqual(204);
    });
  });
});
