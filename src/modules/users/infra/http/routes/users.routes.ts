import type { FastifyInstance } from 'fastify';

import { AuthenticateUserController } from '@/modules/users/infra/http/controllers/AuthenticateUserController.js';
import { CreateUserController } from '@/modules/users/infra/http/controllers/CreateUserController.js';
import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', (request, reply) =>
    createUserController.handle(request, reply),
  );
  app.post('/sessions', (request, reply) =>
    authenticateUserController.handle(request, reply),
  );

  app.get('/me', { preHandler: verifyJWT }, (request, reply) => {
    return reply.status(200).send(request.user);
  });
}
