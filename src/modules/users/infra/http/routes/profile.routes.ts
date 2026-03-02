import { FastifyInstance } from 'fastify';

import { DeleteUserController } from '@/modules/users/infra/http/controllers/DeleteUserController.js';
import { GetUserProfileController } from '@/modules/users/infra/http/controllers/GetUserProfileController.js';
import { UpdateUserController } from '@/modules/users/infra/http/controllers/UpdateUserController.js';
import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

const getUserProfileController = new GetUserProfileController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();

export async function profileRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', verifyJWT);

  app.get('/me', getUserProfileController.handle);
  app.patch('/me', updateUserController.handle);
  app.delete('/me', deleteUserController.handle);
}
