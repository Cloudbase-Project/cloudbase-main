import { Injectable } from '@nestjs/common';
import { JWT } from 'src/auth/utils/token';
import { Templates } from './utils/Templates';
import Mail from 'nodemailer/lib/mailer';
// import nodemailer from 'nodemailer';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailWorker {
  public transporter: Mail;

  constructor(public Jwt: JWT, public Templates: Templates) {
    this.transporter = nodemailer.createTransport({
      host: process.env.AWS_SERVER_HOST,
      secure: true,
      auth: {
        user: process.env.AWS_SMTP_USERNAME,
        pass: process.env.AWS_SMTP_PASSWORD,
      },
    });
  }

  async sendVerificationEmail({ email, id }: { email: string; id: string }) {
    const token = this.Jwt.newToken<{
      email: string;
      id: string;
      fromEmail: boolean;
    }>({ email: email, id, fromEmail: true }, { expiresIn: '24h' });

    return this.transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Message',
      text: 'Checking 123',
      html: this.Templates.verificationEmailTemplate({
        url: `${process.env.BACKEND_URL}/auth/verify?token=${token}`,
        site: 'www.hse.com',
        email,
      }),
    });
  }

  async sendResetPasswordEmail({ email, id }: { email: string; id: string }) {
    const token = this.Jwt.newToken<{
      email: string;
      id: string;
      fromEmail: boolean;
    }>({ email: email, id, fromEmail: true }, { expiresIn: '24h' });

    return this.transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Reset Password',
      text: 'Checking 123',
      html: this.Templates.resetPasswordTemplate({
        url: `${process.env.NEXTJS_URL}/auth/verify/password?token=${token}`,
        site: 'www.hse.com',
        email,
      }),
    });
  }
}
