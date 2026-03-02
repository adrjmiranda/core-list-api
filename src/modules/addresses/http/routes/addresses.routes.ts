import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

import { CreateAddressController } from '../controllers/CreateAddressController.js';
import { ListAddressesController } from '../controllers/ListAddressesController.js';

const createAddressController = new CreateAddressController();
const listAddressesController = new ListAddressesController();

export async function addressesRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', verifyJWT);

  app.post('/:contactId/addresses', createAddressController.handle);
  app.get('/:contactId/addresses', listAddressesController.handle);
}
