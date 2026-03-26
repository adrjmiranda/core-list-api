import { FastifyReply, FastifyRequest } from 'fastify';

import { createTagBodySchema } from '#/modules/tags/schemas/createTagBodySchema.js';
import { CreateTagService } from '#/modules/tags/services/CreateTagService/CreateTagService.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateTagController {
  constructor(
    @inject(CreateTagService) private createTagService: CreateTagService,
  ) {}

  public handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, color } = createTagBodySchema.parse(request.body);
    const userId = request.user.sub;

    const { tag } = await this.createTagService.execute({
      data: { name, color },
      userId,
    });

    return reply.status(201).send({ tag });
  };
}
