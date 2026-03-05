import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface DeleteContactRequest {
  contactId: string;
  userId: string;
}

export class DeleteContactService {
  public async execute({
    contactId,
    userId,
  }: DeleteContactRequest): Promise<void> {
    const [deletedContact] = await db
      .delete(contacts)
      .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)))
      .returning();

    if (!deletedContact) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND, 404);
    }
  }
}
