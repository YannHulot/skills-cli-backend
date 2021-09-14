import { Request, ResponseToolkit } from '@hapi/hapi';

export const failActionHandler = (_request: Request, _h: ResponseToolkit, err: Error) => {
  // show validation errors to user https://github.com/hapijs/hapi/issues/3706
  throw err;
};
