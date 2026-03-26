import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { listContactsQuerySchema } from '#/modules/contacts/schemas/listContactsQuerySchema.js';
import { ListContactsService } from '#/modules/contacts/services/ListContactsService/ListContactsService.js';

@injectable()
export class ListContactsController {
	constructor(
		@inject(ListContactsService)
		private listContactsService: ListContactsService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const { page, perPage, search, isFavorite, tagIds } =
			listContactsQuerySchema.parse(request.query);
		const userId = request.user.sub;

		const result = await this.listContactsService.execute({
			userId,
			page,
			perPage,
			search,
			isFavorite,
			tagIds,
		});

		return reply.status(200).send(result);
	};
}
