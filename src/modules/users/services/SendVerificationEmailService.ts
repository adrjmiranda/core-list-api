import { IMailProvider } from '@/shared/container/providers/MailProvider/models/IMailProvider.js';
import { env } from '@/shared/env/index.js';

interface Request {
  name: string;
  email: string;
  token: string;
}

export class SendVerificationEmailService {
  constructor(private mailProvider: IMailProvider) {}

  public async execute({ name, email, token }: Request): Promise<void> {
    const confirmationLink = `${env.APP_URL}/users/verify?token=${token}`;

    await this.mailProvider.sendMail({
      to: email,
      subject: 'Verifique sua conta na Core List API',
      body: `
        <div style="font-family: sans-serif; color: #333;">
          <h1>Olá, ${name}!</h1>
          <p>Para ativar sua conta na Core List API, clique no link abaixo:</p>
          <p>
            <a href="${confirmationLink}" target="_blank">Confirmar meu e-mail</a>
          </p>
          <hr />
          <p style="font-size: 12px;">Se você não solicitou este e-mail, pode ignorá-lo.</p>
        </div>
      `,
    });
  }
}
