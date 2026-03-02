import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const updatePasswordBodySchema = z
  .object({
    oldPassword: z.string().min(6, ERROR_CODES.PASSWORD_TOO_SHORT),
    newPassword: z.string().min(6, ERROR_CODES.PASSWORD_TOO_SHORT),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: ERROR_CODES.PASSWORDS_MUST_DIFFERENT,
    path: ['newPassword'],
  });
