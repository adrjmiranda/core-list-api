import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { deleteTagParamsSchema } from '#/modules/tags/schemas/params/deleteTagParamsSchema.js';
import { DeleteTagService } from '#/modules/tags/services/DeleteTagService/DeleteTagService.js';

@injectable()
export class DeleteTagController {
	constructor(
		@inject(DeleteTagService) private deleteTagService: DeleteTagService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const { tagId } = deleteTagParamsSchema.parse(request.params);
		const userId = request.user.sub;

		await this.deleteTagService.execute({ tagId, userId });

		return reply.status(204).send();
	};
}
