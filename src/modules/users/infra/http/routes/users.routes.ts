import type { FastifyInstance } from 'fastify';

import { AuthenticateUserController } from '@/modules/users/infra/http/controllers/AuthenticateUserController.js';
import { CreateUserController } from '@/modules/users/infra/http/controllers/CreateUserController.js';
import { DeleteUserController } from '@/modules/users/infra/http/controllers/DeleteUserController.js';
import { GetUserProfileController } from '@/modules/users/infra/http/controllers/GetUserProfileController.js';
import { UpdateUserController } from '@/modules/users/infra/http/controllers/UpdateUserController.js';
import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const getUserProfileController = new GetUserProfileController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', createUserController.handle);
  app.post('/sessions', authenticateUserController.handle);
  app.get('/me', { preHandler: [verifyJWT] }, getUserProfileController.handle);
  app.patch('/me', { preHandler: [verifyJWT] }, updateUserController.handle);
  app.delete('/me', { preHandler: [verifyJWT] }, deleteUserController.handle);
}
