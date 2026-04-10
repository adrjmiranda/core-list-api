import 'reflect-metadata';

import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeTag } from '#/test/factories/faker-data.js';

import { UpdateTagService } from './UpdateTagService.js';

describe('UpdateTagService (Spec)', () => {
	let updateTagService: UpdateTagService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		updateTagService = childContainer.resolve(UpdateTagService);
	});

	it('should throw an error if unexpected database error occurs', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.reject(new Error('Unexpected DB Error')),
				}),
			}),
		}));

		await assert.rejects(async () => {
			await updateTagService.execute({
				tagId: randomUUID(),
				userId: randomUUID(),
				data: {
					name: 'work',
					color: '#AABBCC',
				},
			});
		});
	});

	it('should throw an error if tag does not exist', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await updateTagService.execute({
					tagId: randomUUID(),
					userId: randomUUID(),
					data: {
						name: 'work',
						color: '#AABBCC',
					},
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

	it('should throw an error if a tag with the same name already exists', async (t) => {
		const editedTag = makeFakeTag({ name: 'Old Name' });
		const tagWithSameName = makeFakeTag({ name: 'New Name' });

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => {
						if (selectCalls.mock.callCount() === 1) {
							return Promise.resolve([editedTag]);
						}

						if (selectCalls.mock.callCount() === 2) {
							return Promise.resolve([tagWithSameName]);
						}
					},
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await updateTagService.execute({
					tagId: editedTag.id,
					userId: editedTag.userId,
					data: {
						name: 'New Name',
						color: '#FFFFFF',
					},
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.TAG_ALREADY_EXISTS);
				assert.strictEqual(error.statusCode, 409);
				return true;
			}
		);
	});

	it('should update a tag', async (t) => {
		const fakerTag = makeFakeTag();

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => {
						if (selectCalls.mock.callCount() === 1) {
							return Promise.resolve([fakerTag]);
						}

						if (selectCalls.mock.callCount() === 2) {
							return Promise.resolve([]);
						}
					},
				}),
			}),
		}));

		const mockName = 'Updated Name';
		const mockColor = 'Updated Color';

		t.mock.method(db, 'update', () => ({
			set: () => ({
				where: () => ({
					returning: () =>
						Promise.resolve([
							{ ...fakerTag, name: mockName, color: mockColor },
						]),
				}),
			}),
		}));

		const { tag } = await updateTagService.execute({
			tagId: fakerTag.id,
			userId: fakerTag.userId,
			data: {
				name: mockName,
				color: mockColor,
			},
		});

		assert.ok(tag.id);
		assert.strictEqual(tag.name, mockName);
		assert.strictEqual(tag.color, mockColor);
	});
});
