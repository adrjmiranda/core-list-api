import { and, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { tagsTable } from '#/shared/infra/database/drizzle/tags.js';
import { db } from '#/shared/infra/database/index.js';

interface DeleteTagRequest {
	tagId: string;
	userId: string;
}

@injectable()
export class DeleteTagService {
	public execute = async ({
		tagId,
		userId,
	}: DeleteTagRequest): Promise<void> => {
		const [tag] = await db
			.select()
			.from(tagsTable)
			.where(and(eq(tagsTable.id, tagId), eq(tagsTable.userId, userId)))
			.limit(1);

		if (!tag) {
			throw new AppError(ERROR_CODES.TAG_NOT_FOUND, 404);
		}

		await db.delete(tagsTable).where(eq(tagsTable.id, tagId)).execute();
	};
}
