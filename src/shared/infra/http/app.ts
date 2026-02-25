import fastify from 'fastify';

import { appRoutes } from '@/shared/infra/http/routes.js';

const app = fastify({
  logger: true,
});

void app.register(appRoutes);

export { app };
