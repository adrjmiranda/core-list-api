import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import * as z from 'zod';

import { authenticateBodySchema } from '#/modules/users/schemas/body/authenticateBodySchema.js';
import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';

type AuthenticateUserServiceRequest = z.infer<typeof authenticateBodySchema>;

@injectable()
export class AuthenticateUserService {
	public execute = async ({
		email,
		password,
	}: AuthenticateUserServiceRequest) => {
		const [user] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.limit(1);

		if (!user) {
			throw new AppError(ERROR_CODES.INVALID_CREDENTIALS, 401);
		}

		if (!user.isVerified) {
			throw new AppError(ERROR_CODES.USER_NOT_VERIFIED, 403);
		}

		const passwordMatch = await bcrypt.compare(password, user.passwordHash);

		if (!passwordMatch) {
			throw new AppError(ERROR_CODES.INVALID_CREDENTIALS, 401);
		}

		return { user };
	};
}
