import type { FastifyRequest } from 'fastify';

import { AppError } from '@/shared/errors/AppError.js';

export async function verifyJWT(request: FastifyRequest) {
  try {
    await request.jwtVerify();
  } catch {
    throw new AppError('UNAUTHORIZED', 401);
  }
}
