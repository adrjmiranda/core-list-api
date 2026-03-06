import { eq } from 'drizzle-orm';
import path from 'path';

import uploadConfig from '@/config/upload.js';
import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { IStorageProvider } from '@/shared/container/providers/StorageProvider/models/IStorageProvider.js';
import { AppError } from '@/shared/errors/AppError.js';
import { users } from '@/shared/infra/database/drizzle/users.js';
import { db } from '@/shared/infra/database/index.js';

interface UpdateUserAvatarRequest {
  userId: string;
  avatarFilename: string;
  fileStream: NodeJS.ReadableStream;
}

export class UpdateUserAvatarService {
  constructor(private storageProvider: IStorageProvider) {}

  public async execute({
    userId,
    avatarFilename,
    fileStream,
  }: UpdateUserAvatarRequest): Promise<{ avatar: string | null }> {
    const extension = path.extname(avatarFilename).toLowerCase();

    console.log('DEBUG: avatarFilename recebido ->', avatarFilename);
    console.log('DEBUG: Extensão extraída ->', extension);
    console.log('DEBUG: Lista permitida ->', uploadConfig.allowedExtensions);

    if (!uploadConfig.allowedExtensions.includes(extension)) {
      throw new AppError(ERROR_CODES.INVALID_FILE_TYPE, 400);
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(
      avatarFilename,
      fileStream,
    );

    const [updatedUser] = await db
      .update(users)
      .set({
        avatar: fileName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return { avatar: updatedUser.avatar };
  }
}
