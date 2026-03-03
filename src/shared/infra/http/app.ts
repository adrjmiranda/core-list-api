import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastifyRateLimit from '@fastify/rate-limit';
import fastify from 'fastify';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { env } from '@/shared/env/index.js';
import { globalErrorHandler } from '@/shared/infra/http/handlers/globalErrorHandler.js';
import { appRoutes } from '@/shared/infra/http/routes.js';

const app = fastify({
  logger: true,
});

app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: 60 * 1000,
  errorResponseBuilder: (_request, context) => {
    return {
      code: ERROR_CODES.TOO_MANY_REQUESTS,
      message: `Rate limit exceeded. Try again in ${context.after}.`,
    };
  },
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
