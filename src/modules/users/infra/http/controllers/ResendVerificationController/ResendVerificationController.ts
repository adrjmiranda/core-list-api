import { eq } from 'drizzle-orm';
import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { resendVerificationBodySchema } from '#/modules/users/schemas/resendVerificationBodySchema.js';
import { SendVerificationEmailService } from '#/modules/users/services/SendVerificationEmailService/SendVerificationEmailService.js';
import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';

@injectable()
export class ResendVerificationController {
	constructor(
		@inject(SendVerificationEmailService)
		private sendVerificationEmailService: SendVerificationEmailService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const { email } = resendVerificationBodySchema.parse(request.body);

		const [user] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));

		if (!user) {
			throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
		}

		if (user.isVerified) {
			throw new AppError(ERROR_CODES.USER_ALREADY_VERIFIED, 400);
		}

		await this.sendVerificationEmailService.execute({
			name: user.name,
			email: user.email,
			token: user.verificationToken!,
		});

		return reply
			.status(200)
			.send({ message: 'E-mail de verificação reenviado!' });
	};
}
