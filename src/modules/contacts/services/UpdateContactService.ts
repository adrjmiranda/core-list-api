import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface UpdateContactRequest {
  contactId: string;
  userId: string;
  data: {
    name?: string;
    email?: string | null;
    phone?: string;
  };
}

export class UpdateContactService {
  async execute({ contactId, userId, data }: UpdateContactRequest) {
    const [updatedContact] = await db
      .update(contacts)
      .set({
        ...data,
      })
      .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)))
      .returning();

    if (!updatedContact) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND);
    }

    return { contact: updatedContact };
  }
}
