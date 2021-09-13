import { emailSender } from '../handlers/email';

// Module augmentation to add shared application state
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33809#issuecomment-472103564
declare module '@hapi/hapi' {
  interface ServerApplicationState {
    sendEmailToken(email: string, token: string): Promise<void>;
  }
}

const emailPlugin = {
  name: 'app/email',
  register: emailSender,
};

export default emailPlugin;
