import { eq } from 'drizzle-orm';

import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface ExportContactsCsvRequest {
  userId: string;
}

export class ExportContactsCsvService {
  public async execute({ userId }: ExportContactsCsvRequest): Promise<string> {
    const userContacts = await db
      .select()
      .from(contacts)
      .where(eq(contacts.userId, userId));

    if (userContacts.length === 0) {
      return 'Nome,Email,Telefone\n';
    }

    const header = ['Nome', 'Email', 'Telefone'].join(',');
    const rows = userContacts.map((contact) =>
      [
        `"${contact.name}"`,
        `"${contact.email || ''}"`,
        `"${contact.phone}"`,
      ].join(','),
    );

    return [header, ...rows].join('\n');
  }
}
