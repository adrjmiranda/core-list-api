import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const resendVerificationBodySchema = z.object({
  email: z.email(ERROR_CODES.INVALID_EMAIL),
});
