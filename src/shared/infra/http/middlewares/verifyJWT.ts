import type { FastifyReply, FastifyRequest } from 'fastify';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { AppError } from '@/shared/errors/AppError.js';

export async function verifyJWT(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify();

    if (!request.user.isVerified) {
      throw new AppError(ERROR_CODES.USER_NOT_VERIFIED, 403);
    }
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
  }
}
