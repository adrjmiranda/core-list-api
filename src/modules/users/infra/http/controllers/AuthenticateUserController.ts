import type { FastifyReply, FastifyRequest } from 'fastify';

import { authenticateBodySchema } from '@/modules/users/schemas/authenticateBodySchema.js';
import { AuthenticateUserService } from '@/modules/users/services/AuthenticateUserService.js';
import { env } from '@/shared/env/index.js';

export class AuthenticateUserController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = authenticateBodySchema.parse(request.body);

    const authenticateUserService = new AuthenticateUserService();
    const user = await authenticateUserService.execute({
      email,
      password,
    });

    const accessToken = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id } },
    );

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: '7d' } },
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: env.APP_ENV === 'production',
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        accessToken,
      });
  }
}
