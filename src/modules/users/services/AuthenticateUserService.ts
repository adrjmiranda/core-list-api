import { compare } from 'bcrypt';
import { eq } from 'drizzle-orm';
import * as z from 'zod';

import { authenticateBodySchema } from '@/modules/users/schemas/authenticateBodySchema.js';
import { AppError } from '@/shared/errors/AppError.js';
import { users } from '@/shared/infra/database/drizzle/users.js';
import { db } from '@/shared/infra/database/index.js';

type AuthenticateUserServiceRequest = z.infer<typeof authenticateBodySchema>;

export class AuthenticateUserService {
  public async execute({ email, password }: AuthenticateUserServiceRequest) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      throw new AppError('INVALID_CREDENTIALS', 401);
    }

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new AppError('INVALID_CREDENTIALS', 401);
    }

    return user;
  }
}
