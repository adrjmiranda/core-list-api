import type { FastifyInstance } from 'fastify';

import { AttachTagToContactController } from '@/modules/contacts/infra/http/controllers/AttachTagToContactController.js';
import { CreateContactController } from '@/modules/contacts/infra/http/controllers/CreateContactController.js';
import { DeleteContactController } from '@/modules/contacts/infra/http/controllers/DeleteContactController.js';
import { ExportContactsCsvController } from '@/modules/contacts/infra/http/controllers/ExportContactsCsvController.js';
import { GetContactController } from '@/modules/contacts/infra/http/controllers/GetContactController.js';
import { ListContactsController } from '@/modules/contacts/infra/http/controllers/ListContactsController.js';
import { ShowContactAvatarController } from '@/modules/contacts/infra/http/controllers/ShowContactAvatarController.js';
import { UpdateContactAvatarController } from '@/modules/contacts/infra/http/controllers/UpdateContactAvatarController.js';
import { UpdateContactController } from '@/modules/contacts/infra/http/controllers/UpdateContactController.js';
import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

export async function contactsRoutes(app: FastifyInstance): Promise<void> {
  const createContactController = new CreateContactController();
  const listContactsController = new ListContactsController();
  const getContactController = new GetContactController();
  const updateContactController = new UpdateContactController();
  const deleteContactController = new DeleteContactController();
  const attachTagToContactController = new AttachTagToContactController();
  const updateContactAvatarController = new UpdateContactAvatarController();
  const showContactAvatarController = new ShowContactAvatarController();
  const exportContactsCsvController = new ExportContactsCsvController();

  app.addHook('onRequest', verifyJWT);

  app.post('/', createContactController.handle);
  app.get('/', listContactsController.handle);
  app.get('/:contactId', getContactController.handle);
  app.patch('/:contactId', updateContactController.handle);
  app.delete('/:contactId', deleteContactController.handle);

  app.post('/:contactId/tags/:tagId', attachTagToContactController.handle);

  app.patch('/:contactId/avatar', updateContactAvatarController.handle);
  app.get('/:contactId/avatar', showContactAvatarController.handle);

  app.get('/export/csv', exportContactsCsvController.handle);
}
