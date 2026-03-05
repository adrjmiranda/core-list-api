import { and, eq } from 'drizzle-orm';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';
import { tags } from '@/shared/infra/database/drizzle/tags.js';
import { db } from '@/shared/infra/database/index.js';

interface DeleteTagRequest {
  tagId: string;
  userId: string;
}

export class DeleteTagService {
  public async execute({ tagId, userId }: DeleteTagRequest): Promise<void> {
    const [tag] = await db
      .select()
      .from(tags)
      .where(and(eq(tags.id, tagId), eq(tags.userId, userId)));

    if (!tag) {
      throw new AppError(ERROR_CODES.TAG_NOT_FOUND);
    }

    await db.delete(tags).where(eq(tags.id, tagId));
  }
}
