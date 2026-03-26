import { injectable } from 'tsyringe';

import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import { db } from '#/shared/infra/database/index.js';

interface CreateContactRequest {
	name: string;
	email?: string | null;
	phone: string;
	userId: string;
}

@injectable()
export class CreateContactService {
	public execute = async ({
		name,
		email,
		phone,
		userId,
	}: CreateContactRequest) => {
		const [contact] = await db
			.insert(contactsTable)
			.values({
				name,
				email: email ?? null,
				phone,
				userId,
			})
			.returning();

		return { contact };
	};
}
