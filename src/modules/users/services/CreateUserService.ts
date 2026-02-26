import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

import { AppError } from '@/shared/errors/AppError.js';
import { users } from '@/shared/infra/database/drizzle/users.js';
import { db } from '@/shared/infra/database/index.js';

type CreateUserServiceRequest = typeof users.$inferInsert;

export class CreateUserService {
  async execute(data: CreateUserServiceRequest): Promise<void> {
    const { name, email, passwordHash } = data;

    const [userWithSameEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userWithSameEmail) {
      throw new AppError('USER_ALREADY_EXISTS', 409);
    }

    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    await db.insert(users).values({
      name,
      email,
      passwordHash: hashedPassword,
    });
  }
}
