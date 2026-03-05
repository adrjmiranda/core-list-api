import { FastifyReply, FastifyRequest } from 'fastify';

import { ListTagsService } from '@/modules/tags/services/ListTagsService.js';

export class ListTagsController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;
    const listTagsService = new ListTagsService();

    const { tagList } = await listTagsService.execute({ userId });

    return reply.status(200).send({ tags: tagList });
  }
}
