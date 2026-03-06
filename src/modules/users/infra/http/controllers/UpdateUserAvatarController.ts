import { FastifyReply, FastifyRequest } from 'fastify';

import uploadConfig from '@/config/upload.js';
import { UpdateUserAvatarService } from '@/modules/users/services/UpdateUserAvatarService.js';
import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { DiskStorageProvider } from '@/shared/container/providers/StorageProvider/implementations/DiskStorageProvider.js';
import { AppError } from '@/shared/errors/AppError.js';

export class UpdateUserAvatarController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file();

    if (!data) {
      throw new AppError(ERROR_CODES.FILE_REQUIRED, 400);
    }

    const userId = request.user.sub;

    const storageProvider = new DiskStorageProvider();
    const updateAvatar = new UpdateUserAvatarService(storageProvider);

    const fileName = uploadConfig.generateHashName(data.filename);

    const { avatar } = await updateAvatar.execute({
      userId,
      avatarFilename: fileName,
      fileStream: data.file,
    });

    return reply.status(200).send({ avatar });
  }
}
