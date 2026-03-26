import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { addressesTable } from '#/shared/infra/database/drizzle/addresses.js';
import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import { db } from '#/shared/infra/database/index.js';

interface CreateAddressRequest {
  contactId: string;
  userId: string;
  data: {
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault?: boolean;
  };
}

export class CreateAddressService {
  public async execute({ contactId, userId, data }: CreateAddressRequest) {
    const contact = await db.query.contactsTable.findFirst({
      where: and(
        eq(contactsTable.id, contactId),
        eq(contactsTable.userId, userId),
      ),
    });

    if (!contact) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND, 404);
    }

    const existingAddress = await db.query.addressesTable.findFirst({
      where: eq(addressesTable.contactId, contactId),
    });

    const shouldBeDefault = !existingAddress || data.isDefault === true;

    if (shouldBeDefault) {
      await db
        .update(addressesTable)
        .set({ isDefault: false })
        .where(eq(addressesTable.contactId, contactId));
    }

    const [address] = await db
      .insert(addressesTable)
      .values({
        ...data,
        contactId,
        isDefault: shouldBeDefault,
      })
      .returning();

    return { address };
  }
}
