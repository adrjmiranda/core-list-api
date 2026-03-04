import path from 'node:path';

import { and, eq } from 'drizzle-orm';
import fs from 'fs';
import mime from 'mime-types';

import uploadConfig from '@/config/upload.js';
import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface ShowContactAvatarRequest {
  contactId: string;
  userId: string;
}

export class ShowContactAvatarService {
  public async execute({ contactId, userId }: ShowContactAvatarRequest) {
    const [contact] = await db
      .select()
      .from(contacts)
      .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)))
      .limit(1);

    if (!contact || !contact.avatar) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 404);
    }

    const filePath = path.resolve(uploadConfig.uploadsFolder, contact.avatar);

    if (!fs.existsSync(filePath)) {
      throw new AppError(ERROR_CODES.FILE_NOT_FOUND, 404);
    }

    const contentType = mime.lookup(filePath) || 'application/octet-stream';

    const stream = fs.createReadStream(filePath);

    return { stream, contentType };
  }
}
