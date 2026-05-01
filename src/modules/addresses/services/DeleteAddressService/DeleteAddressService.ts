import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { addressesTable } from '#/shared/infra/database/drizzle/addresses.js';
import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import { db } from '#/shared/infra/database/index.js';

interface DeleteAddressRequest {
	contactId: string;
	addressId: string;
	userId: string;
}

@injectable()
export class DeleteAddressService {
	public execute = async ({
		contactId,
		addressId,
		userId,
	}: DeleteAddressRequest): Promise<void> => {
		const [contact] = await db
			.select()
			.from(contactsTable)
			.where(
				and(eq(contactsTable.id, contactId), eq(contactsTable.userId, userId))
			)
			.limit(1);

		if (!contact) {
			throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND, 404);
		}

		const [deletedAddress] = await db
			.delete(addressesTable)
			.where(
				and(
					eq(addressesTable.id, addressId),
					eq(addressesTable.contactId, contactId)
				)
			)
			.returning();

		if (!deletedAddress) {
			throw new AppError(ERROR_CODES.ADDRESS_NOT_FOUND, 404);
		}
	};
}
