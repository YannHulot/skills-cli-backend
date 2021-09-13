import Hapi from '@hapi/hapi';
import sendgrid from '@sendgrid/mail';
import { debugSendEmailToken, sendEmailToken } from '../helpers/email';

export const emailSender = async (server: Hapi.Server) => {
  if (!process.env.SENDGRID_API_KEY) {
    server.log(
      'warn',
      `The SENDGRID_API_KEY env var must be set, otherwise the API won't be able to send emails. Using debug mode which logs the email tokens instead.`,
    );
    server.app.sendEmailToken = debugSendEmailToken;
  } else {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    server.app.sendEmailToken = sendEmailToken;
  }
};
