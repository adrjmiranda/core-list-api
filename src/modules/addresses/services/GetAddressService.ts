import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { addresses } from '@/shared/infra/database/drizzle/addresses.js';
import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface GetAddressRequest {
  contactId: string;
  addressId: string;
  userId: string;
}

export class GetAddressService {
  public async execute({ contactId, addressId, userId }: GetAddressRequest) {
    const contact = await db.query.contacts.findFirst({
      where: and(eq(contacts.id, contactId), eq(contacts.userId, userId)),
    });

    if (!contact) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND);
    }

    const [address] = await db
      .select()
      .from(addresses)
      .where(
        and(eq(addresses.id, addressId), eq(addresses.contactId, contactId)),
      );

    if (!address) {
      throw new AppError(ERROR_CODES.ADDRESS_NOT_FOUND);
    }

    return { address };
  }
}
