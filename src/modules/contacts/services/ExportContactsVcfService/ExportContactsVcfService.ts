import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import { db } from '#/shared/infra/database/index.js';

interface ExportContactsVcfRequest {
	userId: string;
}

@injectable()
export class ExportContactsVcfService {
	public execute = async ({
		userId,
	}: ExportContactsVcfRequest): Promise<string> => {
		const userContacts = await db
			.select()
			.from(contactsTable)
			.where(eq(contactsTable.userId, userId));

		const vcfContent = userContacts
			.map((contact) =>
				[
					'BEGIN:VCARD',
					'VERSION:3.0',
					`FN:${contact.name}`,
					contact.email ? `EMAIL:${contact.email}` : '',
					`TEL;TYPE=CELL:${contact.phone}`,
					'END:VCARD',
				]
					.filter(Boolean)
					.join('\n')
			)
			.join('\n');

		return vcfContent;
	};
}
