import { FastifyReply, FastifyRequest } from 'fastify';

import { ShowUserAvatarService } from '#/modules/users/services/ShowUserAvatarService/ShowUserAvatarService.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ShowUserAvatarController {
  constructor(
    @inject(ShowUserAvatarService)
    private showUserAvatarService: ShowUserAvatarService,
  ) {}

  public handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.sub;

    const { stream, contentType } = await this.showUserAvatarService.execute({
      userId,
    });

    return reply.status(200).header('Content-Type', contentType).send(stream);
  };
}
