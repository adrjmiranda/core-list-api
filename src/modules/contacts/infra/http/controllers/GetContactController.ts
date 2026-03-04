import type { FastifyReply, FastifyRequest } from 'fastify';

import { getContactParamsSchema } from '@/modules/contacts/schemas/getContactParamsSchema.js';
import { GetContactService } from '@/modules/contacts/services/GetContactService.js';

export class GetContactController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { contactId } = getContactParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const getContactService = new GetContactService();
    const { contact } = await getContactService.execute({ contactId, userId });

    return reply.status(200).send({ contact });
  }
}
