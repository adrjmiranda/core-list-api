import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { addressesTable } from '#/shared/infra/database/drizzle/addresses.js';
import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import { db } from '#/shared/infra/database/index.js';

interface GetAddressRequest {
	contactId: string;
	addressId: string;
	userId: string;
}

@injectable()
export class GetAddressService {
	public execute = async ({
		contactId,
		addressId,
		userId,
	}: GetAddressRequest) => {
		const contact = await db.query.contactsTable.findFirst({
			where: and(
				eq(contactsTable.id, contactId),
				eq(contactsTable.userId, userId)
			),
		});

		if (!contact) {
			throw new AppError(ERROR_CODES.CONTACT_NOT_FOUND, 404);
		}

		const [address] = await db
			.select()
			.from(addressesTable)
			.where(
				and(
					eq(addressesTable.id, addressId),
					eq(addressesTable.contactId, contactId)
				)
			);

		if (!address) {
			throw new AppError(ERROR_CODES.ADDRESS_NOT_FOUND, 404);
		}

		return { address };
	};
}
