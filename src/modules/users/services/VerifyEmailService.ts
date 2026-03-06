import { eq } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { users } from '@/shared/infra/database/drizzle/users.js';
import { db } from '@/shared/infra/database/index.js';

interface VerifyEmailRequest {
  token: string;
}

export class VerifyEmailService {
  public async execute({ token }: VerifyEmailRequest): Promise<void> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.verificationToken, token));

    if (!user) {
      throw new AppError(ERROR_CODES.INVALID_TOKEN, 401);
    }

    if (user.tokenExpiresAt && new Date() > user.tokenExpiresAt) {
      throw new AppError(ERROR_CODES.EXPIRED_TOKEN, 401);
    }

    await db
      .update(users)
      .set({
        isVerified: true,
        verificationToken: null,
        tokenExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();
  }
}
