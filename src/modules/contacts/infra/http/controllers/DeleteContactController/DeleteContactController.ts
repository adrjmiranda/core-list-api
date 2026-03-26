import type { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { getContactParamsSchema } from '#/modules/contacts/schemas/params/getContactParamsSchema.js';
import { DeleteContactService } from '#/modules/contacts/services/DeleteContactService/DeleteContactService.js';

@injectable()
export class DeleteContactController {
	constructor(
		@inject(DeleteContactService)
		private deleteContactService: DeleteContactService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const { contactId } = getContactParamsSchema.parse(request.params);
		const userId = request.user.sub;

		await this.deleteContactService.execute({ contactId, userId });

		return reply.status(204).send();
	};
}
