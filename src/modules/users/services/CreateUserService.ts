import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

import { users } from '@/shared/infra/database/drizzle/users.js';
import { db } from '@/shared/infra/database/index.js';

interface CreateUserServiceRequest {
  name: string;
  email: string;
  password: string;
}

export class CreateUserService {
  async execute({
    name,
    email,
    password,
  }: CreateUserServiceRequest): Promise<void> {
    const [userWithSameEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userWithSameEmail) {
      throw new Error('User with same email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      passwordHash,
    });
  }
}
