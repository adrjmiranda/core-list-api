import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeUser } from '#/test/factories/faker-data.js';

import { UpdateUserService } from './UpdateUserService.js';

describe('UpdateUserService (Spec)', () => {
	let updateUserService: UpdateUserService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		updateUserService = childContainer.resolve(UpdateUserService);
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
				await updateUserService.execute({
					userId: 'user-id',
					data: {
						name: 'John Doe',
					},
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected database error';
			}
		);
	});

	it('should throw an error if email already exists', async (t) => {
		const fakerUser = makeFakeUser();
		const fakerUserWithSameEmail = makeFakeUser({ email: fakerUser.email });

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => {
						if (selectCalls.mock.callCount() === 1) {
							return Promise.resolve([fakerUser]);
						}

						if (selectCalls.mock.callCount() === 2) {
							return Promise.resolve([fakerUserWithSameEmail]);
						}
					},
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await updateUserService.execute({
					userId: fakerUser.id,
					data: {
						email: fakerUser.email,
					},
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.USER_ALREADY_EXISTS);
				assert.strictEqual(error.statusCode, 409);
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
				await updateUserService.execute({
					userId: 'user-id',
					data: {
						name: 'John Doe',
					},
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

	it('should be able to update user', async (t) => {
		const fakerUserToUpdate = makeFakeUser();

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => {
						if (selectCalls.mock.callCount() === 1) {
							return Promise.resolve([fakerUserToUpdate]);
						}

						if (selectCalls.mock.callCount() === 2) {
							return Promise.resolve([]);
						}
					},
				}),
			}),
		}));

		const mockUpdate = t.mock.method(db, 'update', () => ({
			set: () => ({
				where: () => ({
					returning: () =>
						Promise.resolve([
							{
								...fakerUserToUpdate,
								name: 'Update USER NAME',
								email: 'Update USER EMAIL',
							},
						]),
				}),
			}),
		}));

		const updatedUser = await updateUserService.execute({
			userId: fakerUserToUpdate.id,
			data: {
				name: 'Update USER NAME',
				email: 'Update USER EMAIL',
			},
		});

		assert.strictEqual(selectCalls.mock.callCount(), 2);

		assert.strictEqual(mockUpdate.mock.callCount(), 1);
		assert.strictEqual(updatedUser.user.name, 'Update USER NAME');
		assert.strictEqual(updatedUser.user.email, 'Update USER EMAIL');
	});
});
