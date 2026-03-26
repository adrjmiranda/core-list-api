import { eq } from 'drizzle-orm';

import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';

export class DeleteUserService {
  public async execute(userId: string): Promise<void> {
    await db.delete(usersTable).where(eq(usersTable.id, userId));
  }
}
