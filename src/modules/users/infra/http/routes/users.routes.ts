import type { FastifyInstance } from 'fastify';

import { CreateUserController } from '@/modules/users/infra/http/controllers/CreateUserController.js';

const createUserController = new CreateUserController();

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', (request, reply) =>
    createUserController.handle(request, reply),
  );
}
