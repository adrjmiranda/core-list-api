import type { FastifyReply, FastifyRequest } from 'fastify';

import { getContactParamsSchema } from '@/modules/contacts/schemas/getContactParamsSchema.js';
import { updateContactBodySchema } from '@/modules/contacts/schemas/updateContactBodySchema.js';
import { UpdateContactService } from '@/modules/contacts/services/UpdateContactService.js';

export class UpdateContactController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { contactId } = getContactParamsSchema.parse(request.params);
    const userId = request.user.sub;
    const data = updateContactBodySchema.parse(request.body);

    const updateContactService = new UpdateContactService();

    const { contact } = await updateContactService.execute({
      contactId,
      userId,
      data,
    });

    return reply.status(200).send({ contact });
  }
}
