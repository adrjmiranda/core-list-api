import { eq } from 'drizzle-orm';
import { FastifyReply, FastifyRequest } from 'fastify';

import { resendVerificationBodySchema } from '@/modules/users/schemas/resendVerificationBodySchema.js';
import { SendVerificationEmailService } from '@/modules/users/services/SendVerificationEmailService.js';
import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { EtherealMailProvider } from '@/shared/container/providers/MailProvider/implementations/EtherealMailProvider.js';
import { AppError } from '@/shared/errors/AppError.js';
import { users } from '@/shared/infra/database/drizzle/users.js';
import { db } from '@/shared/infra/database/index.js';

export class ResendVerificationController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { email } = resendVerificationBodySchema.parse(request.body);

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
    }

    if (user.isVerified) {
      throw new AppError(ERROR_CODES.USER_ALREADY_VERIFIED, 400);
    }

    const sendMail = new SendVerificationEmailService(
      new EtherealMailProvider(),
    );
    await sendMail.execute({
      name: user.name,
      email: user.email,
      token: user.verificationToken!,
    });

    return reply
      .status(200)
      .send({ message: 'E-mail de verificação reenviado!' });
  }
}
