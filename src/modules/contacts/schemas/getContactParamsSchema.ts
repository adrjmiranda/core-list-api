import * as z from 'zod';

export const getContactParamsSchema = z.object({
  contactId: z.uuid(),
});
