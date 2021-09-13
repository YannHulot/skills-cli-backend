import Hapi from '@hapi/hapi';
import sendgrid from '@sendgrid/mail';

export const emailSender = async (server: Hapi.Server) => {
  const sendgridAPIKey = process.env.SENDGRID_API_KEY || null;

  if (sendgridAPIKey) {
    sendgrid.setApiKey(sendgridAPIKey);
    server.app.sendEmailToken = sendEmailToken;
  }
};

const sendEmailToken = async (email: string, token: string) => {
  const msg = {
    to: email,
    from: 'norman@prisma.io',
    subject: 'Login token for the modern backend API',
    text: `The login token for the API is: ${token}`,
  };

  await sendgrid.send(msg);
};
