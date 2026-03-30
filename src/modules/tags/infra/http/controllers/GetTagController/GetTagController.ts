import { inject, injectable } from 'tsyringe';

import { getTagParamsSchema } from '#/modules/tags/schemas/params/getTagParamsSchema.js';
import { GetTagService } from '#/modules/tags/services/GetTagService/GetTagService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class GetTagController {
	constructor(@inject(GetTagService) private getTagService: GetTagService) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { tagId } = getTagParamsSchema.parse(httpRequest.params);
		const userId = String(httpRequest.userId);

		const { tag } = await this.getTagService.execute({ tagId, userId });

		return {
			statusCode: 200,
			body: { tag },
		};
	};
}
