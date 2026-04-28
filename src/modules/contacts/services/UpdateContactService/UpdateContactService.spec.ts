import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { faker } from '@faker-js/faker';
import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeContact } from '#/test/factories/faker-data.js';

import { UpdateContactService } from './UpdateContactService.js';

describe('UpdateContactService (Spec)', () => {
	let updateContactService: UpdateContactService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		updateContactService = childContainer.resolve(UpdateContactService);
	});

	it('should throw an error if database unexpected error occurs', async (t) => {
		t.mock.method(db, 'update', () => ({
			set: () => ({
				where: () => ({
					returning: () => Promise.reject(new Error('Unexpected DB Error')),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await updateContactService.execute({
					contactId: faker.string.uuid(),
					userId: faker.string.uuid(),
					data: {
						email: faker.internet.email(),
						name: faker.person.fullName(),
						phone: faker.phone.number(),
					},
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should throw an error if the contact does not update', async (t) => {
		t.mock.method(db, 'update', () => ({
			set: () => ({
				where: () => ({
					returning: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await updateContactService.execute({
					contactId: faker.string.uuid(),
					userId: faker.string.uuid(),
					data: {
						email: faker.internet.email(),
						name: faker.person.fullName(),
						phone: faker.phone.number(),
					},
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.CONTACT_NOT_FOUND);
				assert.strictEqual(error.statusCode, 404);
				return true;
			}
		);
	});

	it('should update a contact', async (t) => {
		const updatedEmail = faker.internet.email();
		const updatedName = faker.person.fullName();
		const updatedPhone = faker.phone.number();

		const fakerContact = makeFakeContact();
		const updatedFakerContact = makeFakeContact({
			id: fakerContact.id,
			userId: fakerContact.userId,
			email: updatedEmail,
			name: updatedName,
			phone: updatedPhone,
		});

		t.mock.method(db, 'update', () => ({
			set: () => ({
				where: () => ({
					returning: () => Promise.resolve([updatedFakerContact]),
				}),
			}),
		}));

		const { contact } = await updateContactService.execute({
			contactId: fakerContact.id,
			userId: fakerContact.userId,
			data: {
				email: updatedEmail,
				name: updatedName,
				phone: updatedPhone,
			},
		});

		assert.ok(contact);
		assert.strictEqual(contact.email, updatedEmail);
		assert.strictEqual(contact.name, updatedName);
		assert.strictEqual(contact.phone, updatedPhone);
	});
});
