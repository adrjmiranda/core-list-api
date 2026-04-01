import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { inject, injectable } from 'tsyringe';

import { SendVerificationEmailService } from '#/modules/users/services/SendVerificationEmailService/SendVerificationEmailService.js';
import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';

type CreateUserServiceRequest = typeof usersTable.$inferInsert;

@injectable()
export class CreateUserService {
	constructor(
		@inject(SendVerificationEmailService)
		private sendVerificationEmailService: SendVerificationEmailService
	) {}

	public execute = async (
		data: CreateUserServiceRequest
	): Promise<{ user: { id: string; name: string; email: string } }> => {
		const { name, email, passwordHash } = data;

		const [userWithSameEmail] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.limit(1);

		if (userWithSameEmail) {
			throw new AppError(ERROR_CODES.USER_ALREADY_EXISTS, 409);
		}

		const hashedPassword = await bcrypt.hash(passwordHash, 10);

		const verificationToken = crypto.randomUUID();
		const tokenExpiresAt = new Date();
		tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 24);

		const [user] = await db
			.insert(usersTable)
			.values({
				name,
				email,
				passwordHash: hashedPassword,
				verificationToken,
				isVerified: false,
				tokenExpiresAt,
			})
			.returning({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
			});

		await this.sendVerificationEmailService.execute({
			name: user.name,
			email: user.email,
			token: verificationToken,
		});

		return { user };
	};
}
