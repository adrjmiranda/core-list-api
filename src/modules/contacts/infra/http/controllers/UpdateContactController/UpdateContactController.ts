import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { updateContactBodySchema } from '#/modules/contacts/schemas/body/updateContactBodySchema.js';
import { getContactParamsSchema } from '#/modules/contacts/schemas/params/getContactParamsSchema.js';
import { UpdateContactService } from '#/modules/contacts/services/UpdateContactService/UpdateContactService.js';

@injectable()
export class UpdateContactController {
	constructor(
		@inject(UpdateContactService)
		private updateContactService: UpdateContactService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const { contactId } = getContactParamsSchema.parse(request.params);
		const userId = request.user.sub;
		const data = updateContactBodySchema.parse(request.body);

		const { contact } = await this.updateContactService.execute({
			contactId,
			userId,
			data,
		});

		return reply.status(200).send({ contact });
	};
}
