import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { addressesTable } from '#/shared/infra/database/drizzle/addresses.js';
import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import { db } from '#/shared/infra/database/index.js';

interface UpdateAddressRequest {
	contactId: string;
	addressId: string;
	userId: string;
	data: {
		street?: string;
		number?: string;
		complement?: string | null;
		neighborhood?: string;
		city?: string;
		state?: string;
		zipCode?: string;
		isDefault?: boolean;
	};
}

@injectable()
export class UpdateAddressService {
	public execute = async ({
		contactId,
		addressId,
		userId,
		data,
	}: UpdateAddressRequest) => {
		const contact = await db.query.contactsTable.findFirst({
			where: and(
				eq(contactsTable.id, contactId),
				eq(contactsTable.userId, userId)
			),
		});

		if (!contact) {
			throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND, 404);
		}

		if (data.isDefault === true) {
			await db
				.update(addressesTable)
				.set({ isDefault: false })
				.where(eq(addressesTable.contactId, contactId));
		}

		const [updatedAddress] = await db
			.update(addressesTable)
			.set(data)
			.where(
				and(
					eq(addressesTable.id, addressId),
					eq(addressesTable.contactId, contactId)
				)
			)
			.returning();

		if (!updatedAddress) {
			throw new AppError(ERROR_CODES.ADDRESS_NOT_FOUND, 404);
		}

		return { address: updatedAddress };
	};
}
