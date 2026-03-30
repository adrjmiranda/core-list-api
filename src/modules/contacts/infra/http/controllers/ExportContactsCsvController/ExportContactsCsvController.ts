import { inject, injectable } from 'tsyringe';

import { ExportContactsCsvService } from '#/modules/contacts/services/ExportContactsCsvService/ExportContactsCsvService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class ExportContactsCsvController {
	constructor(
		@inject(ExportContactsCsvService)
		private exportContactsCsvService: ExportContactsCsvService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const userId = String(httpRequest.userId);

		const csvContent = await this.exportContactsCsvService.execute({ userId });

		const fileName = `contacts-${new Date().getTime()}.csv`;

		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'text/csv',
				'Content-Disposition': `attachment; filename="${fileName}"`,
			},
			body: csvContent,
		};
	};
}
