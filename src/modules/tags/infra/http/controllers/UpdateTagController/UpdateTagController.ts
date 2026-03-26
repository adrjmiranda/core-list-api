import { FastifyReply, FastifyRequest } from 'fastify';

import { updateTagBodySchema } from '#/modules/tags/schemas/updateTagBodySchema.js';
import { updateTagParamsSchema } from '#/modules/tags/schemas/updateTagParamsSchema.js';
import { UpdateTagService } from '#/modules/tags/services/UpdateTagService/UpdateTagService.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UpdateTagController {
  constructor(
    @inject(UpdateTagService) private updateTagService: UpdateTagService,
  ) {}

  public handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const { tagId } = updateTagParamsSchema.parse(request.params);
    const userId = request.user.sub;
    const { name, color } = updateTagBodySchema.parse(request.body);

    const { tag } = await this.updateTagService.execute({
      tagId,
      userId,
      data: { name, color },
    });

    return reply.status(200).send({ tag });
  };
}
