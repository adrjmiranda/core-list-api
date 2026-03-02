import { eq } from 'drizzle-orm';

import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface ListContactsRequest {
  userId: string;
}

export class ListContactsService {
  async execute({ userId }: ListContactsRequest) {
    const userContacts = await db
      .select()
      .from(contacts)
      .where(eq(contacts.userId, userId));

    return { contacts: userContacts };
  }
}
