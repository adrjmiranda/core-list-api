import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const updateUserBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, ERROR_CODES.NAME_REQUIRED)
    .max(50, ERROR_CODES.NAME_LIMIT_EXCEEDED)
    .regex(/^[a-zA-Z0-9À-ÿ\s-]+$/, ERROR_CODES.INVALID_NAME),
  email: z.email(ERROR_CODES.INVALID_EMAIL).trim().optional(),
});
