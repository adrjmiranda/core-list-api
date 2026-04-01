import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import bcrypt from 'bcrypt';
import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeUser } from '#/test/factories/faker-data.js';

import { SendVerificationEmailService } from '../SendVerificationEmailService/SendVerificationEmailService.js';
import { CreateUserService } from './CreateUserService.js';

describe('CreateUserService (Spec)', () => {
	let createUserService: CreateUserService;
	let sendVerificationEmailService: SendVerificationEmailService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();

		childContainer.registerInstance('MailProvider', {
			sendMail: () => Promise.resolve(),
		});

		sendVerificationEmailService = childContainer.resolve(
			SendVerificationEmailService
		);

		childContainer.registerInstance(
			SendVerificationEmailService,
			sendVerificationEmailService
		);

		createUserService = childContainer.resolve(CreateUserService);
	});

	it('should throw an error if an unexpected database error occurs', async (t) => {
		const fakerUserData = makeFakeUser();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.reject(new Error('Unexpected DB Error')),
				}),
			}),
		}));

		await assert.rejects(
			() =>
				createUserService.execute({
					...fakerUserData,
				}),
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should create a new user', async (t) => {
		const fakerUserData = makeFakeUser();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		t.mock.method(db, 'insert', () => ({
			values: () => ({
				returning: () => Promise.resolve([fakerUserData]),
			}),
		}));

		t.mock.method(bcrypt, 'hash', () => Promise.resolve('hashed_password'));
		const sendVerificationEmailServiceExecuteFnMock = t.mock.method(
			sendVerificationEmailService,
			'execute',
			() => Promise.resolve()
		);

		const createdUser = await createUserService.execute({ ...fakerUserData });

		assert.ok(createdUser.user.id);
		assert.strictEqual(createdUser.user.email, fakerUserData.email);
		assert.strictEqual(
			sendVerificationEmailServiceExecuteFnMock.mock.callCount(),
			1
		);
	});

	it('should throw an error if a user with the same email already exists', async (t) => {
		const fakerUser = makeFakeUser();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerUser]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await createUserService.execute({ ...fakerUser });
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.USER_ALREADY_EXISTS);
				assert.strictEqual(error.statusCode, 409);
				return true;
			}
		);
	});
});
