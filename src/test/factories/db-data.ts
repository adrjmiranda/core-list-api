import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';

import { makeFakeUser } from './faker-data.js';

type UserEntity = typeof usersTable.$inferSelect;

export async function createUser(
	overrides: Partial<UserEntity> = {}
): Promise<UserEntity> {
	const userData = makeFakeUser({ ...overrides });
	const [user] = await db.insert(usersTable).values(userData).returning();

	return user;
}
