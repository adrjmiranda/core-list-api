import { FastifyReply, FastifyRequest } from 'fastify';

import { updatePasswordBodySchema } from '@/modules/users/schemas/updatePasswordBodySchema.js';
import { UpdatePasswordService } from '@/modules/users/services/UpdatePasswordService.js';

export class UpdatePasswordController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;
    const { oldPassword, newPassword } = updatePasswordBodySchema.parse(
      request.body,
    );

    const updatePasswordService = new UpdatePasswordService();

    await updatePasswordService.execute({
      userId,
      oldPassword,
      newPassword,
    });

    return reply.status(204).send();
  }
}
