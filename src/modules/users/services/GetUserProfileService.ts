import { eq } from 'drizzle-orm';

import { AppError } from '@/shared/errors/AppError.js';
import { users } from '@/shared/infra/database/drizzle/users.js';
import { db } from '@/shared/infra/database/index.js';

interface GetUserProfileRequest {
  userId: string;
}

export class GetUserProfileService {
  public async execute({ userId }: GetUserProfileRequest) {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 404);
    }

    return { user };
  }
}
