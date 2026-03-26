import { FastifyInstance } from 'fastify';

import { DeleteUserController } from '#/modules/users/infra/http/controllers/DeleteUserController/DeleteUserController.js';
import { GetUserProfileController } from '#/modules/users/infra/http/controllers/GetUserProfileController/GetUserProfileController.js';
import { ShowUserAvatarController } from '#/modules/users/infra/http/controllers/ShowUserAvatarController/ShowUserAvatarController.js';
import { UpdatePasswordController } from '#/modules/users/infra/http/controllers/UpdatePasswordController/UpdatePasswordController.js';
import { UpdateUserAvatarController } from '#/modules/users/infra/http/controllers/UpdateUserAvatarController/UpdateUserAvatarController.js';
import { UpdateUserController } from '#/modules/users/infra/http/controllers/UpdateUserController/UpdateUserController.js';
import { verifyJWT } from '#/shared/infra/http/middlewares/verifyJWT.js';

export async function profileRoutes(app: FastifyInstance): Promise<void> {
  const getUserProfileController = new GetUserProfileController();
  const updateUserController = new UpdateUserController();
  const deleteUserController = new DeleteUserController();
  const updatePasswordController = new UpdatePasswordController();
  const userAvatarController = new UpdateUserAvatarController();
  const showUserAvatarController = new ShowUserAvatarController();

  app.addHook('onRequest', verifyJWT);

  app.get('/me', getUserProfileController.handle);
  app.patch('/me', updateUserController.handle);
  app.delete('/me', deleteUserController.handle);
  app.patch('/me/password', updatePasswordController.handle);

  app.patch('/avatar', userAvatarController.handle);
  app.get('/avatar', showUserAvatarController.handle);
}
