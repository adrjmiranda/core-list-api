import 'reflect-metadata';

import assert from 'node:assert';
import { Readable } from 'node:stream';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeUser } from '#/test/factories/faker-data.js';

import { UpdateUserAvatarService } from './UpdateUserAvatarService.js';

describe('UpdateUserAvatarService (Spec)', () => {
	let updateUserAvatarService: UpdateUserAvatarService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();

		childContainer.registerInstance('StorageProvider', {
			saveFile: () => Promise.resolve('avatar.jpg'),
			deleteFile: () => Promise.resolve(),
		});

		updateUserAvatarService = childContainer.resolve(UpdateUserAvatarService);
	});

	it('should throw an error if an unexpected database error occurs', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.reject(new Error('Unexpected database error')),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await updateUserAvatarService.execute({
					userId: 'user-id',
					avatarFilename: 'avatar.jpg',
					fileStream: new Readable(),
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected database error';
			}
		);
	});

	it('should throw an error if extension is invalid', async () => {
		await assert.rejects(
			async () => {
				await updateUserAvatarService.execute({
					userId: 'user-id',
					avatarFilename: 'avatar.wrongext',
					fileStream: new Readable(),
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.INVALID_FILE_TYPE);
				assert.strictEqual(error.statusCode, 400);
				return true;
			}
		);
	});

	it('should throw an error if user does not exist', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await updateUserAvatarService.execute({
					userId: 'user-id',
					avatarFilename: 'avatar.jpg',
					fileStream: new Readable(),
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.USER_NOT_FOUND);
				assert.strictEqual(error.statusCode, 404);
				return true;
			}
		);
	});

	it('should be able to update user avatar', async (t) => {
		const fakerUser = makeFakeUser();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerUser]),
				}),
			}),
		}));

		const mockUpdate = t.mock.method(db, 'update', () => ({
			set: () => ({
				where: () => ({
					returning: () =>
						Promise.resolve([{ ...fakerUser, avatar: 'avatar.jpg' }]),
				}),
			}),
		}));

		await updateUserAvatarService.execute({
			userId: fakerUser.id,
			avatarFilename: 'avatar.jpg',
			fileStream: new Readable(),
		});

		assert.strictEqual(mockUpdate.mock.callCount(), 1);
	});
});
