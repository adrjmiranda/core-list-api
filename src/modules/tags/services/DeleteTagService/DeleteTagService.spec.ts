import 'reflect-metadata';

import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeTag } from '#/test/factories/faker-data.js';

import { DeleteTagService } from './DeleteTagService.js';

describe('DeleteTagService (Spec)', () => {
	let deleteTagService: DeleteTagService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		deleteTagService = childContainer.resolve(DeleteTagService);
	});

	it('should throw an error if an unexpected database error occurs', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.reject(new Error('Unexpected DB Error')),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await deleteTagService.execute({
					tagId: randomUUID(),
					userId: randomUUID(),
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should throw an error if the tag does not exist', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await deleteTagService.execute({
					tagId: randomUUID(),
					userId: randomUUID(),
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.TAG_NOT_FOUND);
				assert.strictEqual(error.statusCode, 404);
				return true;
			}
		);
	});

	it('should delete a tag', async (t) => {
		const fakerTag = makeFakeTag();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerTag]),
				}),
			}),
		}));

		t.mock.method(db, 'delete', () => ({
			where: () => ({
				execute: () => Promise.resolve(),
			}),
		}));

		await assert.doesNotReject(async () => {
			await deleteTagService.execute({
				tagId: fakerTag.id,
				userId: fakerTag.userId,
			});
		});
	});
});
