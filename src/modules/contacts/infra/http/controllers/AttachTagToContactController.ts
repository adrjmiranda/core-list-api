import { FastifyReply, FastifyRequest } from 'fastify';

import { attachTagParamsSchema } from '@/modules/contacts/schemas/attachTagParamsSchema.js';
import { AttachTagToContactService } from '@/modules/contacts/services/AttachTagToContactService.js';

export class AttachTagToContactController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { contactId, tagId } = attachTagParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const attachTagService = new AttachTagToContactService();

    await attachTagService.execute({
      contactId,
      tagId,
      userId,
    });

    return reply.status(204).send();
  }
}
