import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import { db } from '#/shared/infra/database/index.js';
import { contactListToVcfFormat } from '#/shared/utils/contact-list-to-vcf-format.js';

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

		const contactsInVcfFormat = contactListToVcfFormat(userContacts);

		return contactsInVcfFormat;
	};
}
