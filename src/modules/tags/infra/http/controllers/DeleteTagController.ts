import { FastifyReply, FastifyRequest } from 'fastify';

import { deleteTagParamsSchema } from '@/modules/tags/schemas/deleteTagParamsSchema.js';
import { DeleteTagService } from '@/modules/tags/services/DeleteTagService.js';

export class DeleteTagController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { tagId } = deleteTagParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const deleteTagService = new DeleteTagService();
    await deleteTagService.execute({ tagId, userId });

    return reply.status(204).send();
  }
}
