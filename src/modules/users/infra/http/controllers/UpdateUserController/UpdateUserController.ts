import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { updateUserBodySchema } from '#/modules/users/schemas/updateUserBodySchema.js';
import { UpdateUserService } from '#/modules/users/services/UpdateUserService/UpdateUserService.js';

@injectable()
export class UpdateUserController {
	constructor(
		@inject(UpdateUserService) private updateUserService: UpdateUserService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const userId = request.user.sub;
		const data = updateUserBodySchema.parse(request.body);

		const { user } = await this.updateUserService.execute({ userId, data });

		return reply.status(200).send({ user });
	};
}
