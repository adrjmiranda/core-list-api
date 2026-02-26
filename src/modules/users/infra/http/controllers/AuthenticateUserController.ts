import type { FastifyReply, FastifyRequest } from 'fastify';

import { authenticateBodySchema } from '@/modules/users/schemas/authenticateBodySchema.js';
import { AuthenticateUserService } from '@/modules/users/services/AuthenticateUserService.js';

export class AuthenticateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = authenticateBodySchema.parse(request.body);

    const authenticateUserService = new AuthenticateUserService();
    const user = await authenticateUserService.execute({
      email,
      password,
    });

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    );
    return reply.status(200).send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  }
}
