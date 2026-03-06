import type { FastifyReply, FastifyRequest } from 'fastify';

import { env } from '@/shared/env/index.js';

export class RefreshTokenController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify({ onlyCookie: true });

    const { sub, role, isVerified } = request.user;

    const accessToken = await reply.jwtSign(
      { role, isVerified },
      { sign: { sub } },
    );

    const refreshToken = await reply.jwtSign(
      { role, isVerified },
      { sign: { sub, expiresIn: '7d' } },
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: env.NODE_ENV === 'production',
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        accessToken,
      });
  }
}
