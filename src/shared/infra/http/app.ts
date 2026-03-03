import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';

import { env } from '@/shared/env/index.js';
import { globalErrorHandler } from '@/shared/infra/http/handlers/globalErrorHandler.js';
import { appRoutes } from '@/shared/infra/http/routes.js';

const app = fastify({
  logger: true,
});

app.register(fastifyCookie, {
  secret: env.JWT_SECRET,
});

app.setErrorHandler(globalErrorHandler);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});
app.register(appRoutes);

export { app };
