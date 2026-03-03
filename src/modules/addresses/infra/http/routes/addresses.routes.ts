import { FastifyInstance } from 'fastify';

import { CreateAddressController } from '@/modules/addresses/infra/http/controllers/CreateAddressController.js';
import { DeleteAddressController } from '@/modules/addresses/infra/http/controllers/DeleteAddressController.js';
import { GetAddressController } from '@/modules/addresses/infra/http/controllers/GetAddressController.js';
import { ListAddressesController } from '@/modules/addresses/infra/http/controllers/ListAddressesController.js';
import { UpdateAddressController } from '@/modules/addresses/infra/http/controllers/UpdateAddressController.js';
import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

export async function addressesRoutes(app: FastifyInstance): Promise<void> {
  const createAddressController = new CreateAddressController();
  const listAddressesController = new ListAddressesController();
  const getAddressController = new GetAddressController();
  const updateAddressControoler = new UpdateAddressController();
  const deleteAddressController = new DeleteAddressController();

  app.addHook('onRequest', verifyJWT);

  app.post('/:contactId/addresses', createAddressController.handle);
  app.get('/:contactId/addresses', listAddressesController.handle);
  app.get('/:contactId/addresses/:addressId', getAddressController.handle);
  app.patch('/:contactId/addresses/:addressId', updateAddressControoler.handle);
  app.delete(
    '/:contactId/addresses/:addressId',
    deleteAddressController.handle,
  );
}
