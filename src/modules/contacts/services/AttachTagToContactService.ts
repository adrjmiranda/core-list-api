import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { contactsToTags, tags } from '@/shared/infra/database/drizzle/tags.js';
import { db } from '@/shared/infra/database/index.js';

interface AttachTagToContactRequest {
  contactId: string;
  tagId: string;
  userId: string;
}

export class AttachTagToContactService {
  async execute({ contactId, tagId, userId }: AttachTagToContactRequest) {
    const [contactExists] = await db
      .select()
      .from(contacts)
      .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)));

    if (!contactExists) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND);
    }

    const [tagExists] = await db
      .select()
      .from(tags)
      .where(and(eq(tags.id, tagId), eq(tags.userId, userId)));

    if (!tagExists) {
      throw new AppError(ERROR_CODES.TAG_NOT_FOUND);
    }

    await db.insert(contactsToTags).values({
      contactId,
      tagId,
    });
  }
}
