import { FastifyInstance } from 'fastify';

import { CreateTagController } from '#/modules/tags/infra/http/controllers/CreateTagController/CreateTagController.js';
import { DeleteTagController } from '#/modules/tags/infra/http/controllers/DeleteTagController/DeleteTagController.js';
import { GetTagController } from '#/modules/tags/infra/http/controllers/GetTagController/GetTagController.js';
import { ListTagsController } from '#/modules/tags/infra/http/controllers/ListTagsController/ListTagsController.js';
import { UpdateTagController } from '#/modules/tags/infra/http/controllers/UpdateTagController/UpdateTagController.js';
import { verifyJWT } from '#/shared/infra/http/middlewares/verifyJWT.js';
import { container } from 'tsyringe';

export async function tagsRoutes(app: FastifyInstance) {
  const createTagController = container.resolve(CreateTagController);
  const listTagsController = container.resolve(ListTagsController);
  const deleteTagController = container.resolve(DeleteTagController);
  const getTagController = container.resolve(GetTagController);
  const updateTagController = container.resolve(UpdateTagController);

  app.addHook('onRequest', verifyJWT);

  app.post('/', createTagController.handle);
  app.get('/', listTagsController.handle);
  app.delete('/:tagId', deleteTagController.handle);
  app.get('/:tagId', getTagController.handle);
  app.patch('/:tagId', updateTagController.handle);
}
