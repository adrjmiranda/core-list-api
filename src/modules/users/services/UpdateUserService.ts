import { eq } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { users } from '@/shared/infra/database/drizzle/users.js';
import { db } from '@/shared/infra/database/index.js';

interface UpdateUserRequest {
  userId: string;
  data: {
    name?: string;
    email?: string;
  };
}

export class UpdateUserService {
  public async execute({ userId, data }: UpdateUserRequest) {
    if (data.email) {
      const userWithSameEmail = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (userWithSameEmail && userWithSameEmail.id !== userId) {
        throw new AppError(ERROR_CODES.USER_ALREADY_EXISTS, 409);
      }
    }

    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();

    return { user: updatedUser };
  }
}
