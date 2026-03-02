import { FastifyReply, FastifyRequest } from 'fastify';

import { updateUserBodySchema } from '@/modules/users/schemas/userSchemas.js';
import { UpdateUserService } from '@/modules/users/services/UpdateUserService.js';

export class UpdateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;
    const data = updateUserBodySchema.parse(request.body);

    const updateUserService = new UpdateUserService();
    const { user } = await updateUserService.execute({ userId, data });

    return reply.status(200).send({ user });
  }
}
