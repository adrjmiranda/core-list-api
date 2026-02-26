import bcrypt from 'bcrypt';

import { prisma } from '@/shared/infra/database/prisma.js';

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
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new Error('User with same email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });
  }
}
