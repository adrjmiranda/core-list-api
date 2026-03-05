import { and, count, eq } from 'drizzle-orm';

import tagsConfig from '@/config/tags.js';
import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { tags } from '@/shared/infra/database/drizzle/tags.js';
import { db } from '@/shared/infra/database/index.js';

interface CreateTagRequest {
  name: string;
  userId: string;
}

// TODO: Verificar se o código de erro está correto nos outros services e controllers
export class CreateTagService {
  public async execute({ name, userId }: CreateTagRequest) {
    const [result] = await db
      .select({ total: count() })
      .from(tags)
      .where(eq(tags.userId, userId));

    if (result.total >= tagsConfig.limitPerUser) {
      throw new AppError(ERROR_CODES.TAG_LIMIT_EXCEEDED, 400);
    }

    const [existingTag] = await db
      .select()
      .from(tags)
      .where(and(eq(tags.name, name), eq(tags.userId, userId)));

    if (existingTag) {
      throw new AppError(ERROR_CODES.TAG_ALREADY_EXISTS);
    }

    const [tag] = await db
      .insert(tags)
      .values({
        name,
        userId,
      })
      .returning();

    return { tag };
  }
}
