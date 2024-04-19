import config from 'config';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

function createEmailTransport() {
  const transporter: Mail = nodemailer.createTransport({
    host: config.get<string>('email.host'),
    port: config.get<number>('email.port'),
    secure: config.get<boolean>('email.secure'),
    auth: {
      user: config.get<string>('email.auth.user'),
      pass: config.get<string>('email.auth.pass')
    }
  });

  return transporter;
}

export default createEmailTransport;
