import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { addresses } from '@/shared/infra/database/drizzle/addresses.js';
import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface DeleteAddressRequest {
  contactId: string;
  addressId: string;
  userId: string;
}

export class DeleteAddressService {
  public async execute({
    contactId,
    addressId,
    userId,
  }: DeleteAddressRequest): Promise<void> {
    const contact = await db.query.contacts.findFirst({
      where: and(eq(contacts.id, contactId), eq(contacts.userId, userId)),
    });

    if (!contact) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND);
    }

    const [deletedAddress] = await db
      .delete(addresses)
      .where(
        and(eq(addresses.id, addressId), eq(addresses.contactId, contactId)),
      )
      .returning();

    if (!deletedAddress) {
      throw new AppError(ERROR_CODES.ADDRESS_NOT_FOUND);
    }
  }
}
