import { FastifyReply, FastifyRequest } from 'fastify';

import { updateTagBodySchema } from '@/modules/tags/schemas/updateTagBodySchema.js';
import { updateTagParamsSchema } from '@/modules/tags/schemas/updateTagParamsSchema.js';
import { UpdateTagService } from '@/modules/tags/services/UpdateTagService.js';

export class UpdateTagController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { tagId } = updateTagParamsSchema.parse(request.params);
    const userId = request.user.sub;
    const { name, color } = updateTagBodySchema.parse(request.body);

    const updateTagService = new UpdateTagService();
    const { tag } = await updateTagService.execute({
      tagId,
      userId,
      data: { name, color },
    });

    return reply.status(200).send({ tag });
  }
}
