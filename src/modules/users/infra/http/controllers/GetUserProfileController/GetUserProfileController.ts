import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { GetUserProfileService } from '#/modules/users/services/GetUserProfileService/GetUserProfileService.js';

@injectable()
export class GetUserProfileController {
	constructor(
		@inject(GetUserProfileService)
		private getUserProfileService: GetUserProfileService
	) {}

	public handle = async (request: FastifyRequest, response: FastifyReply) => {
		const { user } = await this.getUserProfileService.execute({
			userId: request.user.sub,
		});

		return response.status(200).send({ user });
	};
}
