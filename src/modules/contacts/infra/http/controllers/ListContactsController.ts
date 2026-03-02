import { FastifyReply, FastifyRequest } from 'fastify';

import { ListContactsService } from '@/modules/contacts/infra/services/ListContactsService.js';

export class ListContactsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;
    const listContactsService = new ListContactsService();

    const { contacts } = await listContactsService.execute({ userId });

    return reply.status(200).send({ contacts });
  }
}
