import { FastifyInstance } from 'fastify';

import { CreateTagController } from '@/modules/tags/infra/http/controllers/CreateTagController.js';
import { DeleteTagController } from '@/modules/tags/infra/http/controllers/DeleteTagController.js';
import { GetTagController } from '@/modules/tags/infra/http/controllers/GetTagController.js';
import { ListTagsController } from '@/modules/tags/infra/http/controllers/ListTagsController.js';
import { UpdateTagController } from '@/modules/tags/infra/http/controllers/UpdateTagController.js';
import { verifyJWT } from '@/shared/infra/http/middlewares/verifyJWT.js';

export async function tagsRoutes(app: FastifyInstance) {
  const createTagController = new CreateTagController();
  const listTagsController = new ListTagsController();
  const deleteTagController = new DeleteTagController();
  const getTagController = new GetTagController();
  const updateTagController = new UpdateTagController();

  app.addHook('onRequest', verifyJWT);

  app.post('/', createTagController.handle);
  app.get('/', listTagsController.handle);
  app.delete('/:tagId', deleteTagController.handle);
  app.get('/:tagId', getTagController.handle);
  app.patch('/:tagId', updateTagController.handle);
}
