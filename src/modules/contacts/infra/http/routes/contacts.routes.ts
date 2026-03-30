import type { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

import { AttachTagToContactController } from '#/modules/contacts/infra/http/controllers/AttachTagToContactController/AttachTagToContactController.js';
import { CreateContactController } from '#/modules/contacts/infra/http/controllers/CreateContactController/CreateContactController.js';
import { DeleteContactController } from '#/modules/contacts/infra/http/controllers/DeleteContactController/DeleteContactController.js';
import { ExportContactsCsvController } from '#/modules/contacts/infra/http/controllers/ExportContactsCsvController/ExportContactsCsvController.js';
import { GetContactController } from '#/modules/contacts/infra/http/controllers/GetContactController/GetContactController.js';
import { ListContactsController } from '#/modules/contacts/infra/http/controllers/ListContactsController/ListContactsController.js';
import { ShowContactAvatarController } from '#/modules/contacts/infra/http/controllers/ShowContactAvatarController/ShowContactAvatarController.js';
import { UpdateContactAvatarController } from '#/modules/contacts/infra/http/controllers/UpdateContactAvatarController/UpdateContactAvatarController.js';
import { UpdateContactController } from '#/modules/contacts/infra/http/controllers/UpdateContactController/UpdateContactController.js';
import { httpRouteAdapter } from '#/shared/adapters/HttpRouteAdapter.js';
import { verifyJWT } from '#/shared/infra/http/middlewares/verifyJWT.js';

import { ExportContactsVcfController } from '../controllers/ExportContactsVcfController/ExportContactsVcfController.js';

export async function contactsRoutes(app: FastifyInstance): Promise<void> {
	const createContactController = container.resolve(CreateContactController);
	const listContactsController = container.resolve(ListContactsController);
	const getContactController = container.resolve(GetContactController);
	const updateContactController = container.resolve(UpdateContactController);
	const deleteContactController = container.resolve(DeleteContactController);
	const attachTagToContactController = container.resolve(
		AttachTagToContactController
	);
	const updateContactAvatarController = container.resolve(
		UpdateContactAvatarController
	);
	const showContactAvatarController = container.resolve(
		ShowContactAvatarController
	);
	const exportContactsCsvController = container.resolve(
		ExportContactsCsvController
	);
	const exportContactsVcfController = container.resolve(
		ExportContactsVcfController
	);

	app.addHook('onRequest', verifyJWT);

	app.post('/', httpRouteAdapter(createContactController));
	app.get('/', httpRouteAdapter(listContactsController));
	app.get('/:contactId', httpRouteAdapter(getContactController));
	app.patch('/:contactId', httpRouteAdapter(updateContactController));
	app.delete('/:contactId', httpRouteAdapter(deleteContactController));

	app.post(
		'/:contactId/tags/:tagId',
		httpRouteAdapter(attachTagToContactController)
	);

	app.patch(
		'/:contactId/avatar',
		httpRouteAdapter(updateContactAvatarController)
	);
	app.get('/:contactId/avatar', httpRouteAdapter(showContactAvatarController));

	app.get('/export/csv', httpRouteAdapter(exportContactsCsvController));
	app.get('/export/vcf', httpRouteAdapter(exportContactsVcfController));
}
