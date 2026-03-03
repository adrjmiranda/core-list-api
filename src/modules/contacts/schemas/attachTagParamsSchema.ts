import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const attachTagParamsSchema = z.object({
  contactId: z.uuid(ERROR_CODES.INVALID_UUID),
  tagId: z.uuid(ERROR_CODES.INVALID_UUID),
});
