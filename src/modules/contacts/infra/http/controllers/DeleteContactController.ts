import type { FastifyReply, FastifyRequest } from 'fastify';

import { getContactParamsSchema } from '@/modules/contacts/schemas/getContactParamsSchema.js';
import { DeleteContactService } from '@/modules/contacts/services/DeleteContactService.js';

export class DeleteContactController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { contactId } = getContactParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const deleteContactService = new DeleteContactService();

    await deleteContactService.execute({ contactId, userId });

    return reply.status(204).send();
  }
}
