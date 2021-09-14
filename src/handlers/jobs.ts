import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { parse } from 'date-fns';
import { JobInput } from '../types/jobs';

export const getAuthenticatedUserJobs = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;
  const { userId } = request.auth.credentials;

  try {
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        companyName: true,
        stack: true,
      },
      where: {
        userId,
      },
    });

    if (!jobs) {
      return h.response([]).code(200);
    } else {
      return h.response(jobs).code(200);
    }
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to get user jobs');
  }
};

export const getAllJobsHandler = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;

  try {
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        companyName: true,
        stack: true,
      },
    });

    if (!jobs) {
      return h.response([]).code(200);
    } else {
      return h.response(jobs).code(200);
    }
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to get all jobs');
  }
};

export const getJobHandler = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;
  const jobId = parseInt(request.params.jobId, 10);

  try {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        companyName: true,
        stack: true,
      },
    });

    if (!job) {
      return Boom.notFound();
    } else {
      return h.response(job).code(200);
    }
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to get job');
  }
};

export const createJobHandler = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;
  const { userId } = request.auth.credentials;
  const payload = request.payload as JobInput;
  const startDate = parse(payload.startDate, 'dd-MM-yyyy', new Date());
  const endDate = payload.endDate ? parse(payload.endDate, 'dd-MM-yyyy', new Date()) : null;

  try {
    const createdJob = await prisma.job.create({
      data: {
        companyName: payload.companyName,
        title: payload.title,
        description: payload.description,
        stack: payload.stack || [],
        startDate,
        endDate,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        companyName: true,
        stack: true,
      },
    });
    return h.response(createdJob).code(201);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to create job');
  }
};

export const deleteJobHandler = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;
  const jobId = parseInt(request.params.jobId, 10);

  try {
    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });

    return h.response().code(204);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to delete job');
  }
};

export const deleteJobsHandler = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;
  const { userId } = request.auth.credentials;

  try {
    await prisma.job.deleteMany({
      where: {
        userId,
      },
    });

    return h.response().code(204);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to delete jobs');
  }
};

export const updateJobHandler = async (request: Request, h: ResponseToolkit) => {
  const { prisma } = request.server.app;
  const jobId = parseInt(request.params.jobId, 10);
  const payload = request.payload as Partial<JobInput>;

  try {
    const updatedJob = await prisma.job.update({
      where: {
        id: jobId,
      },
      data: payload,
    });
    return h.response(updatedJob).code(200);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to update job');
  }
};
