import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import { db } from '#/shared/infra/database/index.js';
import { injectable } from 'tsyringe';

interface GetContactRequest {
  contactId: string;
  userId: string;
}

@injectable()
export class GetContactService {
  public execute = async ({ contactId, userId }: GetContactRequest) => {
    const [contact] = await db
      .select()
      .from(contactsTable)
      .where(
        and(eq(contactsTable.id, contactId), eq(contactsTable.userId, userId)),
      );

    if (!contact) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND, 404);
    }

    return { contact };
  };
}
