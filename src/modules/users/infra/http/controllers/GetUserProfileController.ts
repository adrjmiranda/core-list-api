import { FastifyReply, FastifyRequest } from 'fastify';

import { GetUserProfileService } from '@/modules/users/services/GetUserProfileService.js';

export class GetUserProfileController {
  public async handle(request: FastifyRequest, response: FastifyReply) {
    const getUserProfile = new GetUserProfileService();

    const { user } = await getUserProfile.execute({
      userId: request.user.sub,
    });

    return response.status(200).send({ user });
  }
}
