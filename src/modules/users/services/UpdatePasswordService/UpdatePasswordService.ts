import { compare, hash } from 'bcrypt';
import { eq } from 'drizzle-orm';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';

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
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
    });

    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, 404);
    }

    const isOldPasswordCorrect = await compare(oldPassword, user.passwordHash);

    if (!isOldPasswordCorrect) {
      throw new AppError(ERROR_CODES.INVALID_CREDENTIALS, 401);
    }

    const newPasswordHash = await hash(newPassword, 10);

    await db
      .update(usersTable)
      .set({ passwordHash: newPasswordHash })
      .where(eq(usersTable.id, userId));
  }
}
