import { inject, injectable } from 'tsyringe';

import uploadConfig from '#/config/upload.js';
import { UpdateUserAvatarService } from '#/modules/users/services/UpdateUserAvatarService/UpdateUserAvatarService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';
import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';

@injectable()
export class UpdateUserAvatarController {
	constructor(
		@inject(UpdateUserAvatarService)
		private updateAvatarService: UpdateUserAvatarService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		if (!httpRequest.file) {
			throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
		}

		const data = await httpRequest.file();

		if (!data) {
			throw new AppError(ERROR_CODES.FILE_REQUIRED, 400);
		}

		const userId = String(httpRequest.userId);

		const fileName = uploadConfig.generateHashName(data.filename);

		const { avatar } = await this.updateAvatarService.execute({
			userId,
			avatarFilename: fileName,
			fileStream: data.file,
		});

		return {
			statusCode: 200,
			body: { avatar },
		};
	};
}
