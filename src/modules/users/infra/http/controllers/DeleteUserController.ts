import { FastifyReply, FastifyRequest } from 'fastify';

import { DeleteUserService } from '@/modules/users/services/DeleteUserService.js';

export class DeleteUserController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;

    const deleteUserService = new DeleteUserService();
    await deleteUserService.execute(userId);

    return reply.status(204).send();
  }
}
