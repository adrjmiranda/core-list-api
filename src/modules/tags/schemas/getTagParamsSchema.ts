import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const getTagParamsSchema = z.object({
  tagId: z.uuid(ERROR_CODES.INVALID_UUID),
});
