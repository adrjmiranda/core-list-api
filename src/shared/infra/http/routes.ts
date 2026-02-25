import type { FastifyInstance } from 'fastify';

import { usersRoutes } from '@/modules/users/infra/http/routes/users.routes.js';

export async function appRoutes(app: FastifyInstance): Promise<void> {
  await app.register(usersRoutes, { prefix: '/users' });
}
