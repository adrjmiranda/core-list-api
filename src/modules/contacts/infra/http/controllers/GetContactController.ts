import type { FastifyReply, FastifyRequest } from 'fastify';

import { getContactParamsSchema } from '../../schemas/getContactParamsSchema.js';
import { GetContactService } from '../../services/GetContactService.js';

export class GetContactController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { contactId } = getContactParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const getContactService = new GetContactService();
    const { contact } = await getContactService.execute({ contactId, userId });

    return reply.status(200).send({ contact });
  }
}
