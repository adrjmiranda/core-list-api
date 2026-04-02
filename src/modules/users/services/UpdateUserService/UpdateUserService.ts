import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';

interface UpdateUserRequest {
	userId: string;
	data: {
		name?: string;
		email?: string;
	};
}

@injectable()
export class UpdateUserService {
	public execute = async ({ userId, data }: UpdateUserRequest) => {
		const [user] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, userId))
			.limit(1);

		if (!user) {
			throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
		}

		if (data.email) {
			const [userWithSameEmail] = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, data.email))
				.limit(1);

			if (userWithSameEmail && userWithSameEmail.id !== userId) {
				throw new AppError(ERROR_CODES.USER_ALREADY_EXISTS, 409);
			}
		}

		const [updatedUser] = await db
			.update(usersTable)
			.set(data)
			.where(eq(usersTable.id, userId))
			.returning();

		return { user: updatedUser };
	};
}
