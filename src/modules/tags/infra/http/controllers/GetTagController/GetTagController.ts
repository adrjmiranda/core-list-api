import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { getTagParamsSchema } from '#/modules/tags/schemas/params/getTagParamsSchema.js';
import { GetTagService } from '#/modules/tags/services/GetTagService/GetTagService.js';

@injectable()
export class GetTagController {
	constructor(@inject(GetTagService) private getTagService: GetTagService) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const { tagId } = getTagParamsSchema.parse(request.params);
		const userId = request.user.sub;

		const { tag } = await this.getTagService.execute({ tagId, userId });

		return reply.status(200).send({ tag });
	};
}
