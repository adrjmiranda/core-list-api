import { z } from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const createContactBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, ERROR_CODES.NAME_REQUIRED)
    .max(50, ERROR_CODES.NAME_LIMIT_EXCEEDED)
    .regex(/^[a-zA-Z0-9À-ÿ\s-]+$/, ERROR_CODES.INVALID_NAME)
    .transform((val) => val.replace(/\s+/g, ' ')),
  email: z.email(ERROR_CODES.INVALID_EMAIL).trim().optional().nullable(),
  phone: z
    .string()
    .trim()
    .regex(/^\d+$/, ERROR_CODES.INVALID_PHONE)
    .min(12, ERROR_CODES.INVALID_PHONE)
    .max(15, ERROR_CODES.INVALID_PHONE),
});
