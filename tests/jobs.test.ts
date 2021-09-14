import { createServer } from '../src/server';
import { AuthCredentials, Server } from '@hapi/hapi';
import { createUserCredentials } from './helpers/users';
import { API_AUTH_STRATEGY } from '../src/types/auth';

describe('jobs endpoints', () => {
  let server: Server;
  let testBasicCredentials: AuthCredentials;
  let testAdminCredentials: AuthCredentials;
  let jobId: number;

  beforeAll(async () => {
    server = await createServer();
    // Create a test user and admin and get the credentials object for them
    testBasicCredentials = await createUserCredentials(server.app.prisma, false);
    testAdminCredentials = await createUserCredentials(server.app.prisma, true);
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('without authentication', () => {
    test('does not create a job', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/jobs',
        payload: {
          companyName: 'Prisma Inc',
          title: 'Senior VP of sales',
          description: 'Sell some things to people',
          startDate: '10-10-2020',
          stack: ['test', 'beta'],
        },
      });

      expect(response.statusCode).toEqual(401);
    });
  });

  describe('as a basic user', () => {
    test('creates a job', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/jobs',
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
        payload: {
          companyName: 'Prisma Inc',
          title: 'Senior VP of sales',
          description: 'Sell some things to people',
          startDate: '10-10-2020',
          stack: ['test', 'beta'],
        },
      });

      expect(response.statusCode).toEqual(201);
      jobId = JSON.parse(response.payload)?.id;
      expect(typeof jobId === 'number').toBeTruthy();

      // Update the credentials as they're static in tests (not fetched automatically on request by the auth plugin)
      testBasicCredentials.currentJobs.push(jobId);
    });

    test('does not create job with invalid data', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/jobs',
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
        payload: {
          companyName: 'Prisma Inc',
          title: 'Senior VP of sales',
          description: 'Sell some things to people',
          stack: ['test', 'beta'],
        },
      });

      expect(response.statusCode).toEqual(400);
    });

    test('get jobs returns 404 for non existent job', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/jobs/9999',
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
      });

      expect(response.statusCode).toEqual(403);
    });

    test('get single job with valid ID returns correct job', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/jobs/${jobId}`,
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
      });

      expect(response.statusCode).toEqual(200);
      const job = JSON.parse(response.payload);
      expect(job.id).toBe(jobId);
    });

    test('update job fails with invalid id parameter', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: '/jobs/2888',
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
        payload: {
          companyName: 'test-fake-name',
        },
      });

      expect(response.statusCode).toEqual(403);
    });

    test('update job with valid id', async () => {
      const updatedName = 'Apple';

      const response = await server.inject({
        method: 'PUT',
        url: `/jobs/${jobId}`,
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
        payload: {
          companyName: updatedName,
        },
      });

      expect(response.statusCode).toEqual(200);
      const job = JSON.parse(response.payload);
      expect(job.companyName).toEqual(updatedName);
    });

    test('update job as an admin', async () => {
      const updatedName = 'COMPANY_NAME-UPDATED-BY-ADMIN';

      const response = await server.inject({
        method: 'PUT',
        url: `/jobs/${jobId}`,
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testAdminCredentials,
        },
        payload: {
          companyName: updatedName,
        },
      });

      expect(response.statusCode).toEqual(200);
      const job = JSON.parse(response.payload);
      expect(job.companyName).toEqual(updatedName);
    });

    test('delete jobs fails with invalid id parameter', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/jobs/22',
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
      });

      expect(response.statusCode).toEqual(403);
    });

    test('deletes job successfully', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/jobs/${jobId}`,
        auth: {
          strategy: API_AUTH_STRATEGY,
          credentials: testBasicCredentials,
        },
      });

      expect(response.statusCode).toEqual(204);
    });
  });
});
