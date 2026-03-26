import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import {
  contactsToTagsTable,
  tagsTable,
} from '#/shared/infra/database/drizzle/tags.js';
import { db } from '#/shared/infra/database/index.js';

interface AttachTagToContactRequest {
  contactId: string;
  tagId: string;
  userId: string;
}

export class AttachTagToContactService {
  public async execute({
    contactId,
    tagId,
    userId,
  }: AttachTagToContactRequest) {
    const [contactExists] = await db
      .select()
      .from(contactsTable)
      .where(
        and(eq(contactsTable.id, contactId), eq(contactsTable.userId, userId)),
      );

    if (!contactExists) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND, 404);
    }

    const [tagExists] = await db
      .select()
      .from(tagsTable)
      .where(and(eq(tagsTable.id, tagId), eq(tagsTable.userId, userId)));

    if (!tagExists) {
      throw new AppError(ERROR_CODES.TAG_NOT_FOUND, 404);
    }

    await db.insert(contactsToTagsTable).values({
      contactId,
      tagId,
    });
  }
}
