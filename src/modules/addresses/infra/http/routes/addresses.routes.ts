import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

import { CreateAddressController } from '#/modules/addresses/infra/http/controllers/CreateAddressController/CreateAddressController.js';
import { DeleteAddressController } from '#/modules/addresses/infra/http/controllers/DeleteAddressController/DeleteAddressController.js';
import { GetAddressController } from '#/modules/addresses/infra/http/controllers/GetAddressController/GetAddressController.js';
import { ListAddressesController } from '#/modules/addresses/infra/http/controllers/ListAddressesController/ListAddressesController.js';
import { UpdateAddressController } from '#/modules/addresses/infra/http/controllers/UpdateAddressController/UpdateAddressController.js';
import { httpRouteAdapter } from '#/shared/adapters/HttpRouteAdapter.js';
import { verifyJWT } from '#/shared/infra/http/middlewares/verifyJWT.js';

export async function addressesRoutes(app: FastifyInstance): Promise<void> {
	const createAddressController = container.resolve(CreateAddressController);
	const listAddressesController = container.resolve(ListAddressesController);
	const getAddressController = container.resolve(GetAddressController);
	const updateAddressControoler = container.resolve(UpdateAddressController);
	const deleteAddressController = container.resolve(DeleteAddressController);

	app.addHook('onRequest', verifyJWT);

	app.post('/:contactId/addresses', httpRouteAdapter(createAddressController));
	app.get('/:contactId/addresses', httpRouteAdapter(listAddressesController));
	app.get(
		'/:contactId/addresses/:addressId',
		httpRouteAdapter(getAddressController)
	);
	app.patch(
		'/:contactId/addresses/:addressId',
		httpRouteAdapter(updateAddressControoler)
	);
	app.delete(
		'/:contactId/addresses/:addressId',
		httpRouteAdapter(deleteAddressController)
	);
}
