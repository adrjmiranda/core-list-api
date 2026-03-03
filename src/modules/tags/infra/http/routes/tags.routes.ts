import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

import { CreateTagController } from '../controllers/CreateTagController.js';

const createTagController = new CreateTagController();

export async function tagsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.post('/', createTagController.handle);
}
