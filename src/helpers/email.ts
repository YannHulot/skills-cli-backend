import sendgrid from '@sendgrid/mail';

export const sendEmailToken = async (email: string, token: string) => {
  const msg = {
    to: email,
    from: 'norman@prisma.io',
    subject: 'Login token for the modern backend API',
    text: `The login token for the API is: ${token}`,
  };

  await sendgrid.send(msg);
};

export const debugSendEmailToken = async (email: string, token: string) => {
  console.log(`email token for ${email}: ${token} `);
};
