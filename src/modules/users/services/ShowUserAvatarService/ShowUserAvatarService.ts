import fs from 'node:fs';

import { and, eq } from 'drizzle-orm';
import mime from 'mime-types';
import path from 'path';

import uploadConfig from '#/config/upload.js';
import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';
import { injectable } from 'tsyringe';

interface ShowUserAvatarRequest {
  userId: string;
}

@injectable()
export class ShowUserAvatarService {
  public execute = async ({ userId }: ShowUserAvatarRequest) => {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.id, userId)))
      .limit(1);

    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
    }

    if (!user.avatar) {
      throw new AppError(ERROR_CODES.USER_AVATAR_NOT_FOUND, 401);
    }

    const filePath = path.resolve(uploadConfig.uploadsFolder, user.avatar);

    if (!fs.existsSync(filePath)) {
      throw new AppError(ERROR_CODES.FILE_NOT_FOUND, 404);
    }

    const contentType = mime.lookup(filePath) || 'application/octet-stream';

    console.log('Mime Type identificado:', contentType);

    const stream = fs.createReadStream(filePath);

    return { stream, contentType };
  };
}
