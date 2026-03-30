import { inject, injectable } from 'tsyringe';

import { deleteTagParamsSchema } from '#/modules/tags/schemas/params/deleteTagParamsSchema.js';
import { DeleteTagService } from '#/modules/tags/services/DeleteTagService/DeleteTagService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class DeleteTagController {
	constructor(
		@inject(DeleteTagService) private deleteTagService: DeleteTagService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { tagId } = deleteTagParamsSchema.parse(httpRequest.params);
		const userId = String(httpRequest.userId);

		await this.deleteTagService.execute({ tagId, userId });

		return {
			statusCode: 204,
		};
	};
}
