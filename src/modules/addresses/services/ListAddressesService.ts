import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { addresses } from '@/shared/infra/database/drizzle/addresses.js';
import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface ListAddressesRequest {
  contactId: string;
  userId: string;
}

export class ListAddressesService {
  public async execute({ contactId, userId }: ListAddressesRequest) {
    const contact = await db.query.contacts.findFirst({
      where: and(eq(contacts.id, contactId), eq(contacts.userId, userId)),
    });

    if (!contact) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND, 404);
    }

    const allAddresses = await db
      .select()
      .from(addresses)
      .where(eq(addresses.contactId, contactId))
      .orderBy(addresses.createdAt);

    return { addresses: allAddresses };
  }
}
