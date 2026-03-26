import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { getContactParamsSchema } from '#/modules/contacts/schemas/getContactParamsSchema.js';
import { GetContactService } from '#/modules/contacts/services/GetContactService/GetContactService.js';

@injectable()
export class GetContactController {
	constructor(
		@inject(GetContactService) private getContactService: GetContactService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const { contactId } = getContactParamsSchema.parse(request.params);
		const userId = request.user.sub;

		const { contact } = await this.getContactService.execute({
			contactId,
			userId,
		});

		return reply.status(200).send({ contact });
	};
}
