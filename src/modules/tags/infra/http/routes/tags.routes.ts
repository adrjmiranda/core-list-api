import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

import { CreateTagController } from '../controllers/CreateTagController.js';
import { ListTagsController } from '../controllers/ListTagsController.js';

export async function tagsRoutes(app: FastifyInstance) {
  const createTagController = new CreateTagController();
  const listTagsController = new ListTagsController();

  app.addHook('onRequest', verifyJWT);

  app.post('/', createTagController.handle);
  app.get('/', listTagsController.handle);
}
