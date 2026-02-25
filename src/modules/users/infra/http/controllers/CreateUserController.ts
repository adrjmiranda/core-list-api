import type { FastifyReply, FastifyRequest } from 'fastify';
import * as z from 'zod';

export class CreateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(6),
    });

    const { name, email, password } = createUserBodySchema.parse(request.body);

    return reply.status(201).send({
      name,
      email,
      password,
    });
  }
}
