import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeUser } from '#/test/factories/faker-data.js';

import { VerifyEmailService } from './VerifyEmailService.js';

describe('VerifyEmailService (Spec)', () => {
	let verifyEmailService: VerifyEmailService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		verifyEmailService = childContainer.resolve(VerifyEmailService);
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
				await verifyEmailService.execute({ token: 'token' });
			},
			(error: Error) => {
				return error.message === 'Unexpected database error';
			}
		);
	});

	it('should throw an error if token does not exist', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await verifyEmailService.execute({ token: 'token' });
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.INVALID_TOKEN);
				assert.strictEqual(error.statusCode, 401);
				return true;
			}
		);
	});

	it('should throw an error if token is expired', async (t) => {
		const fakerUser = makeFakeUser({
			tokenExpiresAt: new Date(Date.now() - 1000 * 60 * 60),
		});

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerUser]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await verifyEmailService.execute({
					token: String(fakerUser.verificationToken),
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.EXPIRED_TOKEN);
				assert.strictEqual(error.statusCode, 401);
				return true;
			}
		);
	});

	it('should be able to verify email', async (t) => {
		const fakerUser = makeFakeUser({
			tokenExpiresAt: new Date(Date.now() + 1000),
		});

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerUser]),
				}),
			}),
		}));

		t.mock.method(db, 'update', () => ({
			set: () => ({
				where: () => ({
					returning: () =>
						Promise.resolve([{ ...fakerUser, isVerified: true }]),
				}),
			}),
		}));

		await assert.doesNotReject(async () => {
			await verifyEmailService.execute({
				token: String(fakerUser.verificationToken),
			});
		});
	});
});
