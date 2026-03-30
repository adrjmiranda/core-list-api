import { inject, injectable } from 'tsyringe';

import { ExportContactsVcfService } from '#/modules/contacts/services/ExportContactsVcfService/ExportContactsVcfService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class ExportContactsVcfController {
	constructor(
		@inject(ExportContactsVcfService)
		private exportContactsVcfService: ExportContactsVcfService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const userId = String(httpRequest.userId);

		const vcfContent = await this.exportContactsVcfService.execute({ userId });

		const fileName = `contacts-${new Date().getTime()}.vcf`;

		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'text/vcard; charset=utf-8',
				'Content-Disposition': `attachment; filename="${fileName}"`,
			},
			body: vcfContent,
		};
	};
}
