import { FastifyReply, FastifyRequest } from 'fastify';

import { ExportContactsVcfService } from '#/modules/contacts/services/ExportContactsVcfService/ExportContactsVcfService.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ExportContactsVcfController {
  constructor(
    @inject(ExportContactsVcfService)
    private exportContactsVcfService: ExportContactsVcfService,
  ) {}

  public handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.sub;

    const vcfContent = await this.exportContactsVcfService.execute({ userId });

    const fileName = `contacts-${new Date().getTime()}.vcf`;

    return reply
      .status(200)
      .header('Content-Type', 'text/vcard; charset=utf-8')
      .header('Content-Disposition', `attachment; filename="${fileName}"`)
      .send(vcfContent);
  };
}
