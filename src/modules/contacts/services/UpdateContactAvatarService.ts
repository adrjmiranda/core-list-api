import { eq } from 'drizzle-orm';
import path from 'path';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { IStorageProvider } from '@/shared/container/providers/StorageProvider/models/IStorageProvider.js';
import { AppError } from '@/shared/errors/AppError.js';
import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface IRequest {
  contactId: string;
  userId: string;
  avatarFilename: string;
  fileStream: NodeJS.ReadableStream;
}

export class UpdateContactAvatarService {
  constructor(private storageProvider: IStorageProvider) {}

  public async execute({
    contactId,
    userId,
    avatarFilename,
    fileStream,
  }: IRequest) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const extension = path.extname(avatarFilename).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      throw new AppError(ERROR_CODES.INVALID_FILE_TYPE, 400);
    }

    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, contactId));

    if (!contact) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND, 404);
    }

    if (contact.userId !== userId) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
    }

    if (contact.avatar) {
      await this.storageProvider.deleteFile(contact.avatar);
    }

    const fileName = await this.storageProvider.saveFile(
      avatarFilename,
      fileStream,
    );

    await db
      .update(contacts)
      .set({
        avatar: fileName,
      })
      .where(eq(contacts.id, contactId));

    return fileName;
  }
}
