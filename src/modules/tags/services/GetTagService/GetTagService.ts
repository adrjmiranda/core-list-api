import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { tagsTable } from '#/shared/infra/database/drizzle/tags.js';
import { db } from '#/shared/infra/database/index.js';

interface GetTagRequest {
	tagId: string;
	userId: string;
}

@injectable()
export class GetTagService {
	public execute = async ({ tagId, userId }: GetTagRequest) => {
		const [tag] = await db
			.select()
			.from(tagsTable)
			.where(and(eq(tagsTable.id, tagId), eq(tagsTable.userId, userId)))
			.limit(1);

		if (!tag) {
			throw new AppError(ERROR_CODES.TAG_NOT_FOUND, 404);
		}

		return { tag };
	};
}
