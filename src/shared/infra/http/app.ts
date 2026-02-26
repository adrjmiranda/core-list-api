import fastify from 'fastify';

import { globalErrorHandler } from '@/shared/infra/http/handlers/globalErrorHandler.js';
import { appRoutes } from '@/shared/infra/http/routes.js';

const app = fastify({
  logger: true,
});

app.setErrorHandler(globalErrorHandler);

app.register(appRoutes);

export { app };
