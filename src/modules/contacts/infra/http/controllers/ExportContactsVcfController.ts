import { FastifyReply, FastifyRequest } from 'fastify';

import { ExportContactsVcfService } from '@/modules/contacts/services/ExportContactsVcfService.js';

export class ExportContactsVcfController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;
    const exportContactsVcfService = new ExportContactsVcfService();

    const vcfContent = await exportContactsVcfService.execute({ userId });

    const fileName = `contacts-${new Date().getTime()}.vcf`;

    return reply
      .status(200)
      .header('Content-Type', 'text/vcard; charset=utf-8')
      .header('Content-Disposition', `attachment; filename="${fileName}"`)
      .send(vcfContent);
  }
}
