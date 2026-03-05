import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

// TODO: Criar regex para validar nome
export const updateUserBodySchema = z.object({
  name: z.string().trim().min(1, ERROR_CODES.INVALID_NAME),
  email: z.email(ERROR_CODES.INVALID_EMAIL).trim().optional(),
});
