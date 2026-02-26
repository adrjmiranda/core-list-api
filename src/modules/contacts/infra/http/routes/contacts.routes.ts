import type { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

export async function contactsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', verifyJWT);

  app.post('/', (request, reply) => {
    return reply.status(201).send();
  });
}
