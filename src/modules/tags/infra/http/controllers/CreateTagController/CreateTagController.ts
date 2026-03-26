import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { createTagBodySchema } from '#/modules/tags/schemas/body/createTagBodySchema.js';
import { CreateTagService } from '#/modules/tags/services/CreateTagService/CreateTagService.js';

@injectable()
export class CreateTagController {
	constructor(
		@inject(CreateTagService) private createTagService: CreateTagService
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
