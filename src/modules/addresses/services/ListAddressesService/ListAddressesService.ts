import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { addressesTable } from '#/shared/infra/database/drizzle/addresses.js';
import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import { db } from '#/shared/infra/database/index.js';
import { injectable } from 'tsyringe';

interface ListAddressesRequest {
  contactId: string;
  userId: string;
}

@injectable()
export class ListAddressesService {
  public execute = async ({ contactId, userId }: ListAddressesRequest) => {
    const contact = await db.query.contactsTable.findFirst({
      where: and(
        eq(contactsTable.id, contactId),
        eq(contactsTable.userId, userId),
      ),
    });

    if (!contact) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND, 404);
    }

    const allAddresses = await db
      .select()
      .from(addressesTable)
      .where(eq(addressesTable.contactId, contactId))
      .orderBy(addressesTable.createdAt);

    return { addresses: allAddresses };
  };
}
