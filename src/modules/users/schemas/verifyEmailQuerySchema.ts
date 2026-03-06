import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const verifyEmailQuerySchema = z.object({
  token: z.uuid(ERROR_CODES.INVALID_TOKEN),
});
