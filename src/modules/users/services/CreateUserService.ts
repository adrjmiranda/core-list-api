import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

import { SendVerificationEmailService } from '@/modules/users/services/SendVerificationEmailService.js';
import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { IMailProvider } from '@/shared/container/providers/MailProvider/models/IMailProvider.js';
import { AppError } from '@/shared/errors/AppError.js';
import { users } from '@/shared/infra/database/drizzle/users.js';
import { db } from '@/shared/infra/database/index.js';

type CreateUserServiceRequest = typeof users.$inferInsert;

export class CreateUserService {
  constructor(private mailProvider: IMailProvider) {}

  public async execute(
    data: CreateUserServiceRequest,
  ): Promise<{ user: { id: string; name: string; email: string } }> {
    const { name, email, passwordHash } = data;

    const [userWithSameEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userWithSameEmail) {
      throw new AppError(ERROR_CODES.USER_ALREADY_EXISTS, 409);
    }

    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    const verificationToken = crypto.randomUUID();
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 24);

    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash: hashedPassword,
        verificationToken,
        isVerified: false,
        tokenExpiresAt,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

    const sendVerificationEmail = new SendVerificationEmailService(
      this.mailProvider,
    );

    await sendVerificationEmail.execute({
      name: user.name,
      email: user.email,
      token: verificationToken,
    });

    return { user };
  }
}
