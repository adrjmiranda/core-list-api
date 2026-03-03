import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

import { CreateTagController } from '../controllers/CreateTagController.js';

export async function tagsRoutes(app: FastifyInstance) {
  const createTagController = new CreateTagController();

  app.addHook('onRequest', verifyJWT);

  app.post('/', createTagController.handle);
}
