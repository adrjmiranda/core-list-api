import { eq } from 'drizzle-orm';
import path from 'path';
import { inject, injectable } from 'tsyringe';

import uploadConfig from '#/config/upload.js';
import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { IStorageProvider } from '#/shared/container/providers/StorageProvider/models/IStorageProvider.js';
import { AppError } from '#/shared/errors/AppError.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';

interface UpdateUserAvatarRequest {
	userId: string;
	avatarFilename: string;
	fileStream: NodeJS.ReadableStream;
}

@injectable()
export class UpdateUserAvatarService {
	constructor(
		@inject('StorageProvider')
		private storageProvider: IStorageProvider
	) {}

	public execute = async ({
		userId,
		avatarFilename,
		fileStream,
	}: UpdateUserAvatarRequest): Promise<{ avatar: string | null }> => {
		const extension = path.extname(avatarFilename).toLowerCase();

		console.log('DEBUG: avatarFilename recebido ->', avatarFilename);
		console.log('DEBUG: Extensão extraída ->', extension);
		console.log('DEBUG: Lista permitida ->', uploadConfig.allowedExtensions);

		if (!uploadConfig.allowedExtensions.includes(extension)) {
			throw new AppError(ERROR_CODES.INVALID_FILE_TYPE, 400);
		}

		const [user] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, userId));

		if (!user) {
			throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
		}

		if (user.avatar) {
			await this.storageProvider.deleteFile(user.avatar);
		}

		const fileName = await this.storageProvider.saveFile(
			avatarFilename,
			fileStream
		);

		const [updatedUser] = await db
			.update(usersTable)
			.set({
				avatar: fileName,
				updatedAt: new Date(),
			})
			.where(eq(usersTable.id, userId))
			.returning();

		return { avatar: updatedUser.avatar };
	};
}
