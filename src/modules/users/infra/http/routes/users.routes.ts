import type { FastifyInstance } from 'fastify';

import { AuthenticateUserController } from '@/modules/users/infra/http/controllers/AuthenticateUserController.js';
import { CreateUserController } from '@/modules/users/infra/http/controllers/CreateUserController.js';

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', createUserController.handle);
  app.post('/sessions', authenticateUserController.handle);
}
