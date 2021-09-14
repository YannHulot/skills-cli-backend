import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';

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
        id: userId,
      },
    });

    if (!jobs) {
      return h.response([]).code(200);
    } else {
      return h.response(jobs).code(200);
    }
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation();
  }
};
