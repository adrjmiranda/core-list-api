import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import fs from 'fs';
import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeUser } from '#/test/factories/faker-data.js';

import { ShowUserAvatarService } from './ShowUserAvatarService.js';

describe('ShowUserAvatarService (Spec)', () => {
	let showUserAvatarService: ShowUserAvatarService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		showUserAvatarService = childContainer.resolve(ShowUserAvatarService);
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
				await showUserAvatarService.execute({ userId: 'user_id' });
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should throw an error if user not found', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await showUserAvatarService.execute({ userId: 'user_id' });
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.USER_NOT_FOUND);
				assert.strictEqual(error.statusCode, 404);
				return true;
			}
		);
	});

	it('should throw an error if user avatar not found', async (t) => {
		const fakerUser = makeFakeUser({ avatar: null });

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerUser]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await showUserAvatarService.execute({ userId: fakerUser.id });
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.USER_AVATAR_NOT_FOUND);
				assert.strictEqual(error.statusCode, 401);
				return true;
			}
		);
	});

	it('should throw an error if file not found', async (t) => {
		const fakerUser = makeFakeUser();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerUser]),
				}),
			}),
		}));

		t.mock.method(fs, 'existsSync', () => false);

		await assert.rejects(
			async () => {
				await showUserAvatarService.execute({ userId: fakerUser.id });
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.FILE_NOT_FOUND);
				assert.strictEqual(error.statusCode, 404);
				return true;
			}
		);
	});

	it('should show user avatar', async (t) => {
		const fakerUser = makeFakeUser();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerUser]),
				}),
			}),
		}));

		t.mock.method(fs, 'existsSync', () => true);

		const mockStream = { pipe: () => {} };
		t.mock.method(fs, 'createReadStream', () => mockStream);

		const result = await showUserAvatarService.execute({
			userId: fakerUser.id,
		});

		assert.ok(result.stream);
		assert.strictEqual(result.contentType, 'image/jpeg');
		assert.strictEqual(result.stream, mockStream);
	});
});
