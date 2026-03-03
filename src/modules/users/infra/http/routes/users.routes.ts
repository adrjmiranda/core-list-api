import type { FastifyInstance } from 'fastify';

import { AuthenticateUserController } from '@/modules/users/infra/http/controllers/AuthenticateUserController.js';
import { CreateUserController } from '@/modules/users/infra/http/controllers/CreateUserController.js';
import { RefreshTokenController } from '@/modules/users/infra/http/controllers/RefreshTokenController.js';

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  const createUserController = new CreateUserController();
  const authenticateUserController = new AuthenticateUserController();
  const refreshTokenController = new RefreshTokenController();

  app.post('/', createUserController.handle);
  app.post(
    '/sessions',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: 60 * 1000,
        },
      },
    },
    authenticateUserController.handle,
  );
  app.patch('/token/refresh', refreshTokenController.handle);
}
