import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { attachTagParamsSchema } from '#/modules/contacts/schemas/attachTagParamsSchema.js';
import { AttachTagToContactService } from '#/modules/contacts/services/AttachTagToContactService/AttachTagToContactService.js';

@injectable()
export class AttachTagToContactController {
	constructor(
		@inject(AttachTagToContactService)
		private attachTagToContactService: AttachTagToContactService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const { contactId, tagId } = attachTagParamsSchema.parse(request.params);
		const userId = request.user.sub;

		await this.attachTagToContactService.execute({
			contactId,
			tagId,
			userId,
		});

		return reply.status(204).send();
	};
}
