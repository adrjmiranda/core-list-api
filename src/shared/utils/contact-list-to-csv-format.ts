import { contactsTable } from '../infra/database/drizzle/contacts.js';

type ContactListType = Array<typeof contactsTable.$inferSelect>;

export function contactListToCsvFormat(contacts: ContactListType): string {
	if (contacts.length === 0) {
		return 'Nome,Email,Telefone\n';
	}

	const header = ['Nome', 'Email', 'Telefone'].join(',');
	const rows = contacts.map((contact) =>
		[
			`"${contact.name}"`,
			`"${contact.email || ''}"`,
			`"${contact.phone}"`,
		].join(',')
	);

	return [header, ...rows].join('\n');
}
