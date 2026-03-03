import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { addresses } from '@/shared/infra/database/drizzle/addresses.js';
import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface UpdateAddressRequest {
  contactId: string;
  addressId: string;
  userId: string;
  data: {
    street?: string;
    number?: string;
    complement?: string | null;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    isDefault?: boolean;
  };
}

export class UpdateAddressService {
  async execute({ contactId, addressId, userId, data }: UpdateAddressRequest) {
    const contact = await db.query.contacts.findFirst({
      where: and(eq(contacts.id, contactId), eq(contacts.userId, userId)),
    });

    if (!contact) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND);
    }

    if (data.isDefault === true) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.contactId, contactId));
    }

    const [updatedAddress] = await db
      .update(addresses)
      .set(data)
      .where(
        and(eq(addresses.id, addressId), eq(addresses.contactId, contactId)),
      )
      .returning();

    if (!updatedAddress) {
      throw new AppError(ERROR_CODES.ADDRESS_NOT_FOUND);
    }

    return { address: updatedAddress };
  }
}
