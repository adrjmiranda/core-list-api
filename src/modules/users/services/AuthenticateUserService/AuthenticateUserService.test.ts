import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { usersTable } from '#/shared/infra/database/drizzle/users.js';
import { db } from '#/shared/infra/database/index.js';
import { createUser } from '#/test/factories/db-data.js';

import { AuthenticateUserService } from './AuthenticateUserService.js';

describe('AuthenticateUserService (Integration)', () => {
	let authenticateUserService: AuthenticateUserService;

	beforeEach(async () => {
		await db.delete(usersTable);

		const childContainer = container.createChildContainer();
		authenticateUserService = childContainer.resolve(AuthenticateUserService);
	});

	it('should throw an error if the user does not exist', async () => {
		await assert.rejects(
			async () => {
				await authenticateUserService.execute({
					email: faker.internet.email(),
					password: faker.internet.password(),
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

	it('should throw an error if the user is not verified', async () => {
		const password = faker.internet.password();
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await createUser({
			passwordHash,
			isVerified: false,
		});

		await assert.rejects(
			async () => {
				await authenticateUserService.execute({
					email: user.email,
					password,
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

	it('should throw an error if the password is incorrect', async () => {
		const password = faker.internet.password();
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await createUser({
			passwordHash,
			isVerified: true,
		});

		const incorrectPassword = faker.internet.password();

		await assert.rejects(
			async () => {
				await authenticateUserService.execute({
					email: user.email,
					password: incorrectPassword,
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

	it('the user should be authenticated', async () => {
		const password = faker.internet.password();
		const passwordHash = await bcrypt.hash(password, 10);
		const userData = await createUser({
			passwordHash,
			isVerified: true,
		});

		const { user } = await authenticateUserService.execute({
			email: userData.email,
			password,
		});

		assert.ok(user);
		assert.deepStrictEqual(user, userData);
	});
});
