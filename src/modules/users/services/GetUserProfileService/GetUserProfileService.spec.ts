import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeUser } from '#/test/utils/faker-data.js';

import { GetUserProfileService } from './GetUserProfileService.js';

describe('GetUserProfileService (Spec)', () => {
	let getUserProfileService: GetUserProfileService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		getUserProfileService = childContainer.resolve(GetUserProfileService);
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
				await getUserProfileService.execute({ userId: 'user_id' });
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should get user profile', async (t) => {
		const fakerUser = makeFakeUser();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerUser]),
				}),
			}),
		}));

		const userProfile = await getUserProfileService.execute({
			userId: 'user_id',
		});

		assert.strictEqual(userProfile.user.id, fakerUser.id);
		assert.strictEqual(userProfile.user.name, fakerUser.name);
		assert.strictEqual(userProfile.user.email, fakerUser.email);
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
				await getUserProfileService.execute({ userId: 'user_id' });
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.USER_NOT_FOUND);
				assert.strictEqual(error.statusCode, 404);
				return true;
			}
		);
	});
});
