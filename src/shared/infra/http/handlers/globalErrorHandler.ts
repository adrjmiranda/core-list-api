import * as Sentry from '@sentry/node';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { env } from '@/shared/env/index.js';
import { AppError } from '@/shared/errors/AppError.js';

export function globalErrorHandler(
  error: Error,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ZodError) {
    const validationErrors = error.issues.reduce(
      (acc, issue) => {
        const path = issue.path[0]?.toString();

        if (path) {
          acc[path] = issue.message;
        }

        return acc;
      },
      {} as Record<string, string>,
    );

    return reply.status(400).send({
      code: ERROR_CODES.VALIDATION_ERROR,
      errors: validationErrors,
    });
  }

  if ('statusCode' in error && error.statusCode === 429) {
    return reply.send(error);
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      code: error.code,
    });
  }

  if (
    'code' in error &&
    (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_COOKIE' ||
      error.code === 'FAST_JWT_EXPIRED')
  ) {
    return reply.status(401).send({
      code: ERROR_CODES.UNAUTHORIZED,
    });
  }

  if (env.APP_ENV === 'production' && env.SENTRY_DSN) {
    Sentry.captureException(error);
  }

  console.error(error);
  return reply.status(500).send({
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
  });
}
