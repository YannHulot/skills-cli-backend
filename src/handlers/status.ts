import { Request, ResponseToolkit } from '@hapi/hapi';

export const statusHandler = (_request: Request, h: ResponseToolkit) => {
  return h.response({ up: true }).code(200);
};
