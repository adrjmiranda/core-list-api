import type { FastifyReply, FastifyRequest } from 'fastify';
import * as z from 'zod';

import { CreateUserService } from '@/modules/users/services/CreateUserService.js';

export class CreateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(6),
    });

    const { name, email, password } = createUserBodySchema.parse(request.body);

    try {
      const createUserService = new CreateUserService();

      await createUserService.execute({ name, email, password });

      return reply.status(201).send();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'User with same email already exists'
      ) {
        return reply.status(400).send({
          message: error.message,
        });
      }

      throw error;
    }
  }
}
