import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { ListTagsService } from '#/modules/tags/services/ListTagsService/ListTagsService.js';

@injectable()
export class ListTagsController {
	constructor(
		@inject(ListTagsService) private listTagsService: ListTagsService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const userId = request.user.sub;

		const { tagList } = await this.listTagsService.execute({ userId });

		return reply.status(200).send({ tags: tagList });
	};
}
