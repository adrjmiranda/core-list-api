import { eq } from 'drizzle-orm';

import { AppError } from '#/shared/errors/AppError.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';

interface GetUserProfileRequest {
  userId: string;
}

export class GetUserProfileService {
  public async execute({ userId }: GetUserProfileRequest) {
    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 404);
    }

    return { user };
  }
}
