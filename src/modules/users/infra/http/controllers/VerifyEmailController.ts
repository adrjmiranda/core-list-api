import { FastifyReply, FastifyRequest } from 'fastify';

import { verifyEmailQuerySchema } from '@/modules/users/schemas/verifyEmailQuerySchema.js';
import { VerifyEmailService } from '@/modules/users/services/VerifyEmailService.js';

export class VerifyEmailController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { token } = verifyEmailQuerySchema.parse(request.query);

    const verifyEmail = new VerifyEmailService();
    await verifyEmail.execute({ token });

    return reply.status(204).send();
  }
}
