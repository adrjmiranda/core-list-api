import type { FastifyInstance } from 'fastify';

import { AuthenticateUserController } from '@/modules/users/infra/http/controllers/AuthenticateUserController.js';
import { CreateUserController } from '@/modules/users/infra/http/controllers/CreateUserController.js';
import { RefreshTokenController } from '@/modules/users/infra/http/controllers/RefreshTokenController.js';

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', createUserController.handle);
  app.post('/sessions', authenticateUserController.handle);
  app.patch('/token/refresh', refreshTokenController.handle);
}
