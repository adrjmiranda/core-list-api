import { FastifyReply, FastifyRequest } from 'fastify';

import { createTagSchema } from '@/modules/tags/schemas/createTagSchema.js';
import { CreateTagService } from '@/modules/tags/services/CreateTagService.js';

export class CreateTagController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name } = createTagSchema.parse(request.body);
    const userId = request.user.sub;

    const createTagService = new CreateTagService();
    const { tag } = await createTagService.execute({ name, userId });

    return reply.status(201).send({ tag });
  }
}
