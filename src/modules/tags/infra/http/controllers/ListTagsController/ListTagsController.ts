import { inject, injectable } from 'tsyringe';

import { ListTagsService } from '#/modules/tags/services/ListTagsService/ListTagsService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class ListTagsController {
	constructor(
		@inject(ListTagsService) private listTagsService: ListTagsService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const userId = String(httpRequest.userId);

		const { tagList } = await this.listTagsService.execute({ userId });

		return {
			statusCode: 200,
			body: {
				tags: tagList,
			},
		};
	};
}
