import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import bcrypt from 'bcrypt';
import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeUser } from '#/test/factories/faker-data.js';

import { UpdatePasswordService } from './UpdatePasswordService.js';

describe('UpdatePasswordService (Spec)', () => {
	let updatePasswordService: UpdatePasswordService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		updatePasswordService = childContainer.resolve(UpdatePasswordService);
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
				await updatePasswordService.execute({
					userId: 'user-id',
					oldPassword: 'old-password',
					newPassword: 'new-password',
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected database error';
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
				await updatePasswordService.execute({
					userId: 'user-id',
					oldPassword: 'old-password',
					newPassword: 'new-password',
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

	it('should throw an error if old password is invalid', async (t) => {
		const fakerUser = makeFakeUser();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerUser]),
				}),
			}),
		}));

		t.mock.method(bcrypt, 'compare', () => Promise.resolve(false));

		await assert.rejects(
			async () => {
				await updatePasswordService.execute({
					userId: fakerUser.id,
					oldPassword: 'old-password',
					newPassword: 'new-password',
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.INVALID_CREDENTIALS);
				assert.strictEqual(error.statusCode, 401);
				return true;
			}
		);
	});

	it('should be able to update password', async (t) => {
		const fakerUser = makeFakeUser();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerUser]),
				}),
			}),
		}));

		t.mock.method(bcrypt, 'compare', () => Promise.resolve(true));
		t.mock.method(bcrypt, 'hash', () => Promise.resolve('hashed-password'));

		const mockUpdate = t.mock.method(db, 'update', () => ({
			set: () => ({
				where: () => ({
					execute: () => Promise.resolve(),
				}),
			}),
		}));

		await updatePasswordService.execute({
			userId: fakerUser.id,
			oldPassword: 'old-password',
			newPassword: 'new-password',
		});

		assert.strictEqual(mockUpdate.mock.callCount(), 1);
	});
});
