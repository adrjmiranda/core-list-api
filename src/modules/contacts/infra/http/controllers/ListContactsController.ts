import { FastifyReply, FastifyRequest } from 'fastify';

import { listContactsQuerySchema } from '@/modules/contacts/schemas/listContactsQuerySchema.js';
import { ListContactsService } from '@/modules/contacts/services/ListContactsService.js';

export class ListContactsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { page, perPage, search, isFavorite } = listContactsQuerySchema.parse(
      request.query,
    );
    const userId = request.user.sub;
    const listContactsService = new ListContactsService();

    const result = await listContactsService.execute({
      userId,
      page,
      perPage,
      search,
      isFavorite,
    });

    return reply.status(200).send(result);
  }
}
