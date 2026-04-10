import { faker } from '@faker-js/faker';

import { tagsTable } from '#/shared/infra/database/drizzle/tags.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';

type UserEntity = typeof usersTable.$inferSelect;
type TagEntity = typeof tagsTable.$inferSelect;

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
		userId: faker.string.ulid(),
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	return {
		...defaults,
		...overrides,
	};
}
