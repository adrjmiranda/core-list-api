import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface CreateContactServiceRequest {
  name: string;
  email?: string | null;
  phone: string;
  userId: string;
}

export class CreateContactService {
  async execute({ name, email, phone, userId }: CreateContactServiceRequest) {
    const [contact] = await db
      .insert(contacts)
      .values({
        name,
        email: email ?? null,
        phone,
        userId,
      })
      .returning();

    return { contact };
  }
}
