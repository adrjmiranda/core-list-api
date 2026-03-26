import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { verifyEmailQuerySchema } from '#/modules/users/schemas/verifyEmailQuerySchema.js';
import { VerifyEmailService } from '#/modules/users/services/VerifyEmailService/VerifyEmailService.js';
import { env } from '#/shared/env/index.js';

@injectable()
export class VerifyEmailController {
	constructor(
		@inject(VerifyEmailService) private verifyEmailService: VerifyEmailService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const { token } = verifyEmailQuerySchema.parse(request.query);

		await this.verifyEmailService.execute({ token });

		return reply.redirect(`${env.WEB_URL}/login?verified=true`);
	};
}
