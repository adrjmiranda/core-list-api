import type { FastifyInstance } from 'fastify';

import { AuthenticateUserController } from '@/modules/users/infra/http/controllers/AuthenticateUserController.js';
import { CreateUserController } from '@/modules/users/infra/http/controllers/CreateUserController.js';
import { GetUserProfileController } from '@/modules/users/infra/http/controllers/GetUserProfileController.js';
import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const getUserProfileController = new GetUserProfileController();

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', createUserController.handle);
  app.post('/sessions', authenticateUserController.handle);
  app.get('/me', { preHandler: [verifyJWT] }, getUserProfileController.handle);
}
