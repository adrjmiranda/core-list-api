import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { addresses } from '@/shared/infra/database/drizzle/addresses.js';
import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

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
    const contact = await db.query.contacts.findFirst({
      where: and(eq(contacts.id, contactId), eq(contacts.userId, userId)),
    });

    if (!contact) {
      throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND);
    }

    const existingAddress = await db.query.addresses.findFirst({
      where: eq(addresses.contactId, contactId),
    });

    const shouldBeDefault = !existingAddress || data.isDefault === true;

    if (shouldBeDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.contactId, contactId));
    }

    const [address] = await db
      .insert(addresses)
      .values({
        ...data,
        contactId,
        isDefault: shouldBeDefault,
      })
      .returning();

    return { address };
  }
}
