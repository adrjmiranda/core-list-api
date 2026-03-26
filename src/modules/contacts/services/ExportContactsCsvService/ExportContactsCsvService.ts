import { eq } from 'drizzle-orm';

import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import { db } from '#/shared/infra/database/index.js';
import { injectable } from 'tsyringe';

interface ExportContactsCsvRequest {
  userId: string;
}

@injectable()
export class ExportContactsCsvService {
  public execute = async ({
    userId,
  }: ExportContactsCsvRequest): Promise<string> => {
    const userContacts = await db
      .select()
      .from(contactsTable)
      .where(eq(contactsTable.userId, userId));

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
  };
}
