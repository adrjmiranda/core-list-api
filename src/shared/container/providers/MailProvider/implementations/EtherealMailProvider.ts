import nodemailer, { Transporter } from 'nodemailer';

import {
  IMailProvider,
  ISendMailDTO,
} from '@/shared/container/providers/MailProvider/models/IMailProvider.js';

export class EtherealMailProvider implements IMailProvider {
  private client: Transporter | null = null;

  private async getClient(): Promise<Transporter> {
    if (!this.client) {
      const account = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    }

    return this.client;
  }

  public async sendMail({ to, subject, body }: ISendMailDTO): Promise<void> {
    const transporter = await this.getClient();

    const message = await transporter.sendMail({
      from: 'Core List API <noreply@corelist.com.br>',
      to,
      subject,
      html: body,
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
