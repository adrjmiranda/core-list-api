import { FastifyReply, FastifyRequest } from 'fastify';

import { showContactAvatarParamsSchema } from '@/modules/contacts/schemas/showContactAvatarParamsSchema.js';
import { ShowContactAvatarService } from '@/modules/contacts/services/ShowContactAvatarService.js';

export class ShowContactAvatarController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { contactId } = showContactAvatarParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const showAvatarService = new ShowContactAvatarService();
    const { stream, contentType } = await showAvatarService.execute({
      contactId,
      userId,
    });

    return reply.status(200).header('Content-Type', contentType).send(stream);
  }
}
