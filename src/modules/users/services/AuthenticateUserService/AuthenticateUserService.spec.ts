import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import bcrypt from 'bcrypt';
import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeUser } from '#/test/factories/faker-data.js';

import { AuthenticateUserService } from './AuthenticateUserService.js';

describe('AuthenticateUserService (Spec)', () => {
	let authenticateUserService: AuthenticateUserService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		authenticateUserService = childContainer.resolve(AuthenticateUserService);
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
			() =>
				authenticateUserService.execute({
					email: 'any@email.com',
					password: 'any_password',
				}),
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should authenticate a user', async (t) => {
		const fakerVerifiedUserFromDb = makeFakeUser({ isVerified: true });

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerVerifiedUserFromDb]),
				}),
			}),
		}));

		t.mock.method(bcrypt, 'compare', () => Promise.resolve(true));

		const authenticatedUser = await authenticateUserService.execute({
			email: fakerVerifiedUserFromDb.email,
			password: 'password123',
		});

		assert.strictEqual(authenticatedUser.id, fakerVerifiedUserFromDb.id);
		assert.strictEqual(authenticatedUser.email, fakerVerifiedUserFromDb.email);
	});

	it('should throw an error if user does not exist', async (t) => {
		const fakerUser = makeFakeUser();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await authenticateUserService.execute({
					email: fakerUser.email,
					password: 'password123',
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

	it('should throw an error if user is not verified', async (t) => {
		const fakerUnverifiedUserFromDb = makeFakeUser({ isVerified: false });

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerUnverifiedUserFromDb]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await authenticateUserService.execute({
					email: fakerUnverifiedUserFromDb.email,
					password: 'password123',
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.USER_NOT_VERIFIED);
				assert.strictEqual(error.statusCode, 403);
				return true;
			}
		);
	});

	it('should throw an error if password is invalid', async (t) => {
		const fakerVerifiedUserFromDb = makeFakeUser({ isVerified: true });

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerVerifiedUserFromDb]),
				}),
			}),
		}));

		t.mock.method(bcrypt, 'compare', () => Promise.resolve(false));

		await assert.rejects(
			async () => {
				await authenticateUserService.execute({
					email: fakerVerifiedUserFromDb.email,
					password: 'password123',
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
});
