import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { faker } from '@faker-js/faker';
import { container } from 'tsyringe';

import { db } from '#/shared/infra/database/index.js';
import { makeFakeContact } from '#/test/factories/faker-data.js';

import { CreateContactService } from './CreateContactService.js';

describe('CreateContactService (Spec)', () => {
	let createContactService: CreateContactService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		createContactService = childContainer.resolve(CreateContactService);
	});

	it('should throw an error if database unexpected error occurs', async (t) => {
		t.mock.method(db, 'insert', () => ({
			values: () => ({
				returning: () => Promise.reject(new Error('Unexpected DB Error')),
			}),
		}));

		await assert.rejects(
			async () => {
				await createContactService.execute({
					name: faker.person.fullName(),
					phone: faker.phone.number(),
					userId: faker.string.uuid(),
					email: faker.internet.email(),
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should create a contact', async (t) => {
		const fakerContact = makeFakeContact();

		const insertMock = t.mock.method(db, 'insert', () => ({
			values: () => ({
				returning: () => Promise.resolve([fakerContact]),
			}),
		}));

		await assert.doesNotReject(async () => {
			await createContactService.execute({
				name: fakerContact.name,
				email: fakerContact.email,
				phone: fakerContact.phone,
				userId: fakerContact.userId,
			});
		});

		assert.strictEqual(insertMock.mock.callCount(), 1);
	});
});
