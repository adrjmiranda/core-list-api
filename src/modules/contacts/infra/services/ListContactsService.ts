import { eq } from 'drizzle-orm';

import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface ListContactsServiceRequest {
  userId: string;
}

export class ListContactsService {
  async execute({ userId }: ListContactsServiceRequest) {
    const userContacts = await db
      .select()
      .from(contacts)
      .where(eq(contacts.userId, userId));

    return { contacts: userContacts };
  }
}
