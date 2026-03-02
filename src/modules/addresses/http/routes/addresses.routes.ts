import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

import { CreateAddressController } from '../controllers/CreateAddressController.js';

const createAddressController = new CreateAddressController();

export async function addressesRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', verifyJWT);

  app.post('/:contactId/addresses', createAddressController.handle);
}
