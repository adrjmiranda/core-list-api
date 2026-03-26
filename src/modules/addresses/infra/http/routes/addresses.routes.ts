import { FastifyInstance } from 'fastify';

import { CreateAddressController } from '#/modules/addresses/infra/http/controllers/CreateAddressController/CreateAddressController.js';
import { DeleteAddressController } from '#/modules/addresses/infra/http/controllers/DeleteAddressController/DeleteAddressController.js';
import { GetAddressController } from '#/modules/addresses/infra/http/controllers/GetAddressController/GetAddressController.js';
import { ListAddressesController } from '#/modules/addresses/infra/http/controllers/ListAddressesController/ListAddressesController.js';
import { UpdateAddressController } from '#/modules/addresses/infra/http/controllers/UpdateAddressController/UpdateAddressController.js';
import { verifyJWT } from '#/shared/infra/http/middlewares/verifyJWT.js';
import { container } from 'tsyringe';

export async function addressesRoutes(app: FastifyInstance): Promise<void> {
  const createAddressController = container.resolve(CreateAddressController);
  const listAddressesController = container.resolve(ListAddressesController);
  const getAddressController = container.resolve(GetAddressController);
  const updateAddressControoler = container.resolve(UpdateAddressController);
  const deleteAddressController = container.resolve(DeleteAddressController);

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
