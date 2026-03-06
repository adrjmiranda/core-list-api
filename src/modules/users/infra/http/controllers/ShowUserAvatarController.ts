import { FastifyReply, FastifyRequest } from 'fastify';

import { ShowUserAvatarService } from '@/modules/users/services/ShowUserAvatarService.js';

export class ShowUserAvatarController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;

    const showAvatarService = new ShowUserAvatarService();
    const { stream, contentType } = await showAvatarService.execute({
      userId,
    });

    return reply.status(200).header('Content-Type', contentType).send(stream);
  }
}
