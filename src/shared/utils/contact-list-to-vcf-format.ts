import { contactsTable } from '../infra/database/drizzle/contacts.js';

type ContactListType = Array<typeof contactsTable.$inferSelect>;

export function contactListToVcfFormat(contacts: ContactListType): string {
	const vcfContent = contacts
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
}
