import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { faker } from '@faker-js/faker';
import { container } from 'tsyringe';

import { db } from '#/shared/infra/database/index.js';
import { contactListToCsvFormat } from '#/shared/utils/contact-list-to-csv-format.js';
import { makeFakeContact } from '#/test/factories/faker-data.js';

import { ExportContactsCsvService } from './ExportContactsCsvService.js';

describe('ExportContactsCsvService (Spec)', () => {
	let exportContactsCsvService: ExportContactsCsvService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		exportContactsCsvService = childContainer.resolve(ExportContactsCsvService);
	});

	it('should throw an error if database unexpected error occurs', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => Promise.reject(new Error('Unexpected DB Error')),
			}),
		}));

		await assert.rejects(
			async () => {
				await exportContactsCsvService.execute({
					userId: faker.string.uuid(),
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should only return the header if the contact list is empty', async (t) => {
		const mockHeader = 'Nome,Email,Telefone\n';

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => Promise.resolve([]),
			}),
		}));

		const contactListInCsvFormat = await exportContactsCsvService.execute({
			userId: faker.string.uuid(),
		});

		assert.strictEqual(contactListInCsvFormat, mockHeader);
	});

	it('should export contacts CSV', async (t) => {
		const mockUserId = faker.string.uuid();

		const contactList = [...Array(3).keys()].map(() =>
			makeFakeContact({ userId: mockUserId })
		);

		const mockSelect = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => Promise.resolve(contactList),
			}),
		}));

		const mockContactsInCsvFormat = contactListToCsvFormat(contactList);

		await assert.doesNotReject(async () => {
			const contactListInCsvFormat = await exportContactsCsvService.execute({
				userId: mockUserId,
			});

			assert.strictEqual(mockContactsInCsvFormat, contactListInCsvFormat);
		});

		assert.strictEqual(mockSelect.mock.callCount(), 1);
	});
});
