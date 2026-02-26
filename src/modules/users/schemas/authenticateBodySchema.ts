import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const authenticateBodySchema = z.object({
  email: z.email(ERROR_CODES.INVALID_EMAIL),
  password: z.string().min(6, ERROR_CODES.PASSWORD_TOO_SHORT),
});
