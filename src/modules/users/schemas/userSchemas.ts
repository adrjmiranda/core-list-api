import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const userCoreSchema = {
  name: z.string().min(1, ERROR_CODES.INVALID_NAME),
  email: z.email(ERROR_CODES.INVALID_EMAIL),
  password: z.string().min(6, ERROR_CODES.PASSWORD_TOO_SHORT),
};

export const createUserBodySchema = z.object({
  ...userCoreSchema,
});

export const updateUserBodySchema = z
  .object({
    ...userCoreSchema,
  })
  .partial();
