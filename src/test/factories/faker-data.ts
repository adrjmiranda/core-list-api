import { faker } from '@faker-js/faker';

import { addressesTable } from '#/shared/infra/database/drizzle/addresses.js';
import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import {
	contactsToTagsTable,
	tagsTable,
} from '#/shared/infra/database/drizzle/tags.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';

type UserEntity = typeof usersTable.$inferSelect;
type TagEntity = typeof tagsTable.$inferSelect;
type ContactEntity = typeof contactsTable.$inferSelect;
type ContactToTagEntity = typeof contactsToTagsTable.$inferSelect;
type AddressEntity = typeof addressesTable.$inferSelect;

export function makeFakeUser(overrides: Partial<UserEntity> = {}): UserEntity {
	const defaults: UserEntity = {
		id: faker.string.uuid(),
		email: faker.internet.email().toLowerCase(),
		name: faker.person.fullName(),
		passwordHash: faker.string.alphanumeric(60),
		isVerified: false,
		verificationToken: faker.string.alphanumeric(32),
		tokenExpiresAt: new Date(),
		role: 'USER',
		avatar: `${faker.string.uuid()}.jpg`,
		isActive: true,
		tenantId: faker.string.uuid(),
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	return {
		...defaults,
		...overrides,
	};
}

export function makeFakeTag(overrides: Partial<TagEntity> = {}): TagEntity {
	const defaults: TagEntity = {
		id: faker.string.uuid(),
		name: faker.word.sample(),
		color: faker.color.rgb().toUpperCase(),
		userId: faker.string.uuid(),
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	return {
		...defaults,
		...overrides,
	};
}

export function makeFakeContact(
	overrides: Partial<ContactEntity> = {}
): ContactEntity {
	const defaults: ContactEntity = {
		id: faker.string.uuid(),
		name: faker.word.sample(),
		email: faker.internet.email(),
		phone: faker.phone.number(),

		isFavorite: faker.datatype.boolean(),
		avatar: `${faker.string.uuid()}.jpg`,

		userId: faker.string.uuid(),

		tenantId: faker.string.ulid(),
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	return {
		...defaults,
		...overrides,
	};
}

export function contactsToTags(
	overrides: Partial<TagEntity> = {}
): ContactToTagEntity {
	const defaults: ContactToTagEntity = {
		contactId: faker.string.uuid(),
		tagId: faker.string.uuid(),
	};

	return {
		...defaults,
		...overrides,
	};
}

export function makeFakeAddress(
	overrides: Partial<AddressEntity> = {}
): AddressEntity {
	const defaults: AddressEntity = {
		id: faker.string.uuid(),
		street: faker.location.street(),
		number: faker.location.buildingNumber(),
		complement: faker.string.alpha(16),
		neighborhood: faker.string.alpha(16),
		city: faker.location.city(),
		state: faker.location.state(),
		zipCode: faker.location.zipCode('########'),

		isDefault: false,

		contactId: faker.string.uuid(),

		createdAt: new Date(),
		updatedAt: new Date(),
	};

	return {
		...defaults,
		...overrides,
	};
}
