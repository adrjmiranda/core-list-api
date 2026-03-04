import { FastifyReply, FastifyRequest } from 'fastify';

import uploadConfig from '@/config/upload.js';
import { updateContactAvatarParamsSchema } from '@/modules/contacts/schemas/updateContactAvatarParamsSchema.js';
import { UpdateContactAvatarService } from '@/modules/contacts/services/UpdateContactAvatarService.js';
import { ERROR_CODES } from '@/shared/constants/errorCodes.js';
import { DiskStorageProvider } from '@/shared/container/providers/StorageProvider/implementations/DiskStorageProvider.js';
import { AppError } from '@/shared/errors/AppError.js';

export class UpdateContactAvatarController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file();

    if (!data) {
      throw new AppError(ERROR_CODES.FILE_REQUIRED, 400);
    }

    const { contactId } = updateContactAvatarParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const storageProvider = new DiskStorageProvider();
    const updateAvatar = new UpdateContactAvatarService(storageProvider);

    const fileName = uploadConfig.generateHashName(data.filename);

    const avatar = await updateAvatar.execute({
      contactId,
      userId,
      avatarFilename: fileName,
      fileStream: data.file,
    });

    return reply.status(200).send({ avatar });
  }
}
