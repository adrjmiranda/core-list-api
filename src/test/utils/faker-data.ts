import { faker } from '@faker-js/faker';

import { usersTable } from '#/shared/infra/database/drizzle/users.js';

type UserEntity = typeof usersTable.$inferSelect;

export function makeFakeUser(overrides: Partial<UserEntity> = {}): UserEntity {
	const defaults: UserEntity = {
		id: faker.string.ulid(),
		email: faker.internet.email().toLowerCase(),
		name: faker.person.fullName(),
		passwordHash: faker.string.alphanumeric(60),
		isVerified: false,
		verificationToken: faker.string.alphanumeric(32),
		tokenExpiresAt: new Date(),
		role: 'USER',
		avatar: faker.image.avatar(),
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
