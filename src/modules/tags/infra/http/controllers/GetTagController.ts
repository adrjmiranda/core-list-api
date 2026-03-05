import { FastifyReply, FastifyRequest } from 'fastify';

import { getTagParamsSchema } from '@/modules/tags/schemas/getTagParamsSchema.js';
import { GetTagService } from '@/modules/tags/services/GetTagService.js';

export class GetTagController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { tagId } = getTagParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const getTagService = new GetTagService();
    const { tag } = await getTagService.execute({ tagId, userId });

    return reply.status(200).send({ tag });
  }
}
