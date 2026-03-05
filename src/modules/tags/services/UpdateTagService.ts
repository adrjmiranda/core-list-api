import { and, eq, ne } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { tags } from '@/shared/infra/database/drizzle/tags.js';
import { db } from '@/shared/infra/database/index.js';

interface UpdateTagRequest {
  tagId: string;
  userId: string;
  data: {
    name?: string;
    color?: string;
  };
}

export class UpdateTagService {
  public async execute({ tagId, userId, data }: UpdateTagRequest) {
    const [tag] = await db
      .select()
      .from(tags)
      .where(and(eq(tags.id, tagId), eq(tags.userId, userId)));

    if (!tag) {
      throw new AppError(ERROR_CODES.TAG_NOT_FOUND, 404);
    }

    if (data.name && data.name !== tag.name) {
      const [tagWithSameName] = await db
        .select()
        .from(tags)
        .where(
          and(
            eq(tags.name, data.name),
            eq(tags.userId, userId),
            ne(tags.id, tagId),
          ),
        );

      if (tagWithSameName) {
        throw new AppError(ERROR_CODES.TAG_ALREADY_EXISTS, 409);
      }
    }

    const [updatedTag] = await db
      .update(tags)
      .set({
        name: data.name ?? tag.name,
        color: data.color ?? tag.color,
      })
      .where(and(eq(tags.id, tagId), eq(tags.userId, userId)))
      .returning();

    return { tag: updatedTag };
  }
}
