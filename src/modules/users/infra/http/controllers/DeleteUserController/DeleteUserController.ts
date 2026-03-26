import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { DeleteUserService } from '#/modules/users/services/DeleteUserService/DeleteUserService.js';

@injectable()
export class DeleteUserController {
	constructor(
		@inject(DeleteUserService) private deleteUserService: DeleteUserService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const userId = request.user.sub;

		await this.deleteUserService.execute(userId);

		return reply.status(204).send();
	};
}
