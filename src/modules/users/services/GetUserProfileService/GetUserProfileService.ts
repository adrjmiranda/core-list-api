import { eq } from 'drizzle-orm';

import { AppError } from '#/shared/errors/AppError.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';
import { injectable } from 'tsyringe';

interface GetUserProfileRequest {
  userId: string;
}

@injectable()
export class GetUserProfileService {
  public execute = async ({ userId }: GetUserProfileRequest) => {
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
  };
}
