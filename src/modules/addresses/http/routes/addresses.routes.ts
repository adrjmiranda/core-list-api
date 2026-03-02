import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

import { CreateAddressController } from '../controllers/CreateAddressController.js';
import { GetAddressController } from '../controllers/GetAddressController.js';
import { ListAddressesController } from '../controllers/ListAddressesController.js';
import { UpdateAddressController } from '../controllers/UpdateAddressController.js';

const createAddressController = new CreateAddressController();
const listAddressesController = new ListAddressesController();
const getAddressController = new GetAddressController();
const updateAddressControoler = new UpdateAddressController();

export async function addressesRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', verifyJWT);

  app.post('/:contactId/addresses', createAddressController.handle);
  app.get('/:contactId/addresses', listAddressesController.handle);
  app.get('/:contactId/addresses/:addressId', getAddressController.handle);
  app.patch('/:contactId/addresses/:addressId', updateAddressControoler.handle);
}
