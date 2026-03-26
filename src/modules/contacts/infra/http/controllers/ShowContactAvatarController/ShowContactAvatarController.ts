import { FastifyReply, FastifyRequest } from 'fastify';

import { showContactAvatarParamsSchema } from '#/modules/contacts/schemas/showContactAvatarParamsSchema.js';
import { ShowContactAvatarService } from '#/modules/contacts/services/ShowContactAvatarService/ShowContactAvatarService.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ShowContactAvatarController {
  constructor(
    @inject(ShowContactAvatarService)
    private showContactAvatarService: ShowContactAvatarService,
  ) {}

  public handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const { contactId } = showContactAvatarParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const { stream, contentType } = await this.showContactAvatarService.execute(
      {
        contactId,
        userId,
      },
    );

    return reply.status(200).header('Content-Type', contentType).send(stream);
  };
}
