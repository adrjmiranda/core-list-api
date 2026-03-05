import { FastifyReply, FastifyRequest } from 'fastify';

import { createTagBodySchema } from '@/modules/tags/schemas/createTagBodySchema.js';
import { CreateTagService } from '@/modules/tags/services/CreateTagService.js';

export class CreateTagController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, color } = createTagBodySchema.parse(request.body);
    const userId = request.user.sub;

    const createTagService = new CreateTagService();
    const { tag } = await createTagService.execute({
      data: { name, color },
      userId,
    });

    return reply.status(201).send({ tag });
  }
}
