import type { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

import { CreateContactController } from '../controllers/CreateContactController.js';
import { DeleteContactController } from '../controllers/DeleteContactController.js';
import { GetContactController } from '../controllers/GetContactController.js';
import { ListContactsController } from '../controllers/ListContactsController.js';
import { UpdateContactController } from '../controllers/UpdateContactController.js';

const createContactController = new CreateContactController();
const listContactsController = new ListContactsController();
const getContactController = new GetContactController();
const updateContactController = new UpdateContactController();
const deleteContactController = new DeleteContactController();

export async function contactsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', verifyJWT);

  app.post('/', createContactController.handle);
  app.get('/', listContactsController.handle);
  app.get('/:contactId', getContactController.handle);
  app.patch('/:contactId', updateContactController.handle);
  app.delete('/:contactId', deleteContactController.handle);
}
