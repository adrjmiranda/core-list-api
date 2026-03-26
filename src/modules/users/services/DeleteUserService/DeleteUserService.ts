import { eq } from 'drizzle-orm';

import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';
import { injectable } from 'tsyringe';

@injectable()
export class DeleteUserService {
  public execute = async (userId: string): Promise<void> => {
    await db.delete(usersTable).where(eq(usersTable.id, userId));
  };
}
