import { compare, hash } from 'bcrypt';
import { eq } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { users } from '@/shared/infra/database/drizzle/users.js';
import { db } from '@/shared/infra/database/index.js';

interface UpdatePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export class UpdatePasswordService {
  public async execute({
    userId,
    oldPassword,
    newPassword,
  }: UpdatePasswordRequest) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND);
    }

    const isOldPasswordCorrect = await compare(oldPassword, user.passwordHash);

    if (!isOldPasswordCorrect) {
      throw new AppError(ERROR_CODES.INVALID_CREDENTIALS);
    }

    const newPasswordHash = await hash(newPassword, 10);

    await db
      .update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, userId));
  }
}
