import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';

interface UpdatePasswordRequest {
	userId: string;
	oldPassword: string;
	newPassword: string;
}

@injectable()
export class UpdatePasswordService {
	public execute = async ({
		userId,
		oldPassword,
		newPassword,
	}: UpdatePasswordRequest) => {
		const [user] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, userId))
			.limit(1);

		if (!user) {
			throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
		}

		const isOldPasswordCorrect = await bcrypt.compare(
			oldPassword,
			user.passwordHash
		);

		if (!isOldPasswordCorrect) {
			throw new AppError(ERROR_CODES.INVALID_CREDENTIALS, 401);
		}

		const newPasswordHash = await bcrypt.hash(newPassword, 10);

		await db
			.update(usersTable)
			.set({ passwordHash: newPasswordHash })
			.where(eq(usersTable.id, userId))
			.execute();
	};
}
