import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import { db } from '#/shared/infra/database/index.js';
import { contactListToCsvFormat } from '#/shared/utils/contact-list-to-csv-format.js';

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

		const contactsInCsvFormat = contactListToCsvFormat(userContacts);

		return contactsInCsvFormat;
	};
}
