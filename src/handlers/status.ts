import { Request, ResponseToolkit } from '@hapi/hapi';

export const statusHandler = (_request: Request, h: ResponseToolkit) => {
  h.response({ up: true }).code(200);
};
