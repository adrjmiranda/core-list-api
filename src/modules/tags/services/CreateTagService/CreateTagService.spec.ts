import 'reflect-metadata';

import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import tagsConfig from '#/config/tags.js';
import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeTag } from '#/test/factories/faker-data.js';

import { CreateTagService } from './CreateTagService.js';

describe('CreateTagService (Spec)', () => {
	let createTagService: CreateTagService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		createTagService = childContainer.resolve(CreateTagService);
	});

	it('should throw an error if an unexpected database error occurs', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => Promise.reject(new Error('Unexpected DB Error')),
			}),
		}));

		await assert.rejects(
			() =>
				createTagService.execute({
					userId: randomUUID(),
					data: {
						name: 'work',
						color: '#33ff44',
					},
				}),
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should throw an error if the number of tags is greater than or equal to the allowed value per user', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => Promise.resolve([{ total: tagsConfig.limitPerUser }]),
			}),
		}));

		await assert.rejects(
			async () => {
				await createTagService.execute({
					userId: randomUUID(),
					data: {
						name: 'work',
						color: '#33ff44',
					},
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.TAG_LIMIT_EXCEEDED);
				assert.strictEqual(error.statusCode, 400);
				return true;
			}
		);
	});

	it('should throw an error if the tag already exists', async (t) => {
		const fakerTag = makeFakeTag();

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => {
					if (selectCalls.mock.callCount() === 1) {
						return Promise.resolve([{ total: tagsConfig.limitPerUser - 1 }]);
					}

					if (selectCalls.mock.callCount() === 2) {
						return {
							limit: () => Promise.resolve([fakerTag]),
						};
					}
				},
			}),
		}));

		await assert.rejects(
			async () => {
				await createTagService.execute({
					userId: randomUUID(),
					data: {
						name: 'work',
						color: '#33ff44',
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

	it('should create an tag', async (t) => {
		const fakerTag = makeFakeTag();

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => {
					if (selectCalls.mock.callCount() === 1) {
						return Promise.resolve([{ total: tagsConfig.limitPerUser - 1 }]);
					}

					if (selectCalls.mock.callCount() === 2) {
						return {
							limit: () => Promise.resolve([]),
						};
					}
				},
			}),
		}));

		t.mock.method(db, 'insert', () => ({
			values: () => ({
				returning: () => Promise.resolve([fakerTag]),
			}),
		}));

		const { tag: createdTag } = await createTagService.execute({
			userId: fakerTag.userId,
			data: {
				name: fakerTag.name,
				color: fakerTag.color,
			},
		});

		assert.strictEqual(selectCalls.mock.callCount(), 2);

		assert.ok(createdTag.id);
		assert.strictEqual(createdTag.id, fakerTag.id);
		assert.strictEqual(createdTag.userId, fakerTag.userId);
		assert.strictEqual(createdTag.name, fakerTag.name);
		assert.strictEqual(createdTag.color, fakerTag.color);
	});
});
