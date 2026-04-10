import { and, eq, ne } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { tagsTable } from '#/shared/infra/database/drizzle/tags.js';
import { db } from '#/shared/infra/database/index.js';

interface UpdateTagRequest {
	tagId: string;
	userId: string;
	data: {
		name?: string;
		color?: string;
	};
}

@injectable()
export class UpdateTagService {
	public execute = async ({ tagId, userId, data }: UpdateTagRequest) => {
		const [tag] = await db
			.select()
			.from(tagsTable)
			.where(and(eq(tagsTable.id, tagId), eq(tagsTable.userId, userId)))
			.limit(1);

		if (!tag) {
			throw new AppError(ERROR_CODES.TAG_NOT_FOUND, 404);
		}

		if (data.name && data.name !== tag.name) {
			const [tagWithSameName] = await db
				.select()
				.from(tagsTable)
				.where(
					and(
						eq(tagsTable.name, data.name),
						eq(tagsTable.userId, userId),
						ne(tagsTable.id, tagId)
					)
				)
				.limit(1);

			if (tagWithSameName) {
				throw new AppError(ERROR_CODES.TAG_ALREADY_EXISTS, 409);
			}
		}

		const [updatedTag] = await db
			.update(tagsTable)
			.set({
				name: data.name ?? tag.name,
				color: data.color ?? tag.color,
			})
			.where(and(eq(tagsTable.id, tagId), eq(tagsTable.userId, userId)))
			.returning();

		return { tag: updatedTag };
	};
}
