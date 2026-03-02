import type { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

import { CreateContactController } from '../controllers/CreateContactController.js';

const createContactController = new CreateContactController();

export async function contactsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', verifyJWT);

  app.post('/', createContactController.handle);
}
