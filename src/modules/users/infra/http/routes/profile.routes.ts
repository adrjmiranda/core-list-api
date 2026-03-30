import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

import { DeleteUserController } from '#/modules/users/infra/http/controllers/DeleteUserController/DeleteUserController.js';
import { GetUserProfileController } from '#/modules/users/infra/http/controllers/GetUserProfileController/GetUserProfileController.js';
import { ShowUserAvatarController } from '#/modules/users/infra/http/controllers/ShowUserAvatarController/ShowUserAvatarController.js';
import { UpdatePasswordController } from '#/modules/users/infra/http/controllers/UpdatePasswordController/UpdatePasswordController.js';
import { UpdateUserAvatarController } from '#/modules/users/infra/http/controllers/UpdateUserAvatarController/UpdateUserAvatarController.js';
import { UpdateUserController } from '#/modules/users/infra/http/controllers/UpdateUserController/UpdateUserController.js';
import { httpRouteAdapter } from '#/shared/adapters/HttpRouteAdapter.js';
import { verifyJWT } from '#/shared/infra/http/middlewares/verifyJWT.js';

export async function profileRoutes(app: FastifyInstance): Promise<void> {
	const getUserProfileController = container.resolve(GetUserProfileController);
	const updateUserController = container.resolve(UpdateUserController);
	const deleteUserController = container.resolve(DeleteUserController);
	const updatePasswordController = container.resolve(UpdatePasswordController);
	const userAvatarController = container.resolve(UpdateUserAvatarController);
	const showUserAvatarController = container.resolve(ShowUserAvatarController);

	app.addHook('onRequest', verifyJWT);

	app.get('/me', httpRouteAdapter(getUserProfileController));
	app.patch('/me', httpRouteAdapter(updateUserController));
	app.delete('/me', httpRouteAdapter(deleteUserController));
	app.patch('/me/password', httpRouteAdapter(updatePasswordController));

	app.patch('/avatar', httpRouteAdapter(userAvatarController));
	app.get('/avatar', httpRouteAdapter(showUserAvatarController));
}
