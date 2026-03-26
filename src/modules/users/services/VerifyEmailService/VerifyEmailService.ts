import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';

interface VerifyEmailRequest {
	token: string;
}

@injectable()
export class VerifyEmailService {
	public execute = async ({ token }: VerifyEmailRequest): Promise<void> => {
		const [user] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.verificationToken, token));

		if (!user) {
			throw new AppError(ERROR_CODES.INVALID_TOKEN, 401);
		}

		if (user.tokenExpiresAt && new Date() > user.tokenExpiresAt) {
			throw new AppError(ERROR_CODES.EXPIRED_TOKEN, 401);
		}

		await db
			.update(usersTable)
			.set({
				isVerified: true,
				verificationToken: null,
				tokenExpiresAt: null,
				updatedAt: new Date(),
			})
			.where(eq(usersTable.id, user.id))
			.returning();
	};
}
