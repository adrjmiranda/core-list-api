import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';

interface DeleteUserRequest {
	userId: string;
}

@injectable()
export class DeleteUserService {
	public execute = async ({ userId }: DeleteUserRequest): Promise<void> => {
		await db.delete(usersTable).where(eq(usersTable.id, userId)).execute();
	};
}
