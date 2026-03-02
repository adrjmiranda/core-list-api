import type { FastifyReply, FastifyRequest } from 'fastify';

import { getContactParamsSchema } from '@/modules/contacts/infra/schemas/getContactParamsSchema.js';
import { updateContactBodySchema } from '@/modules/contacts/infra/schemas/updateContactBodySchema.js';
import { UpdateContactService } from '@/modules/contacts/infra/services/UpdateContactService.js';

export class UpdateContactController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
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
