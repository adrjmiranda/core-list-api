import { SYSTEM_ERRORS } from '@/shared/constants/error-codes/system.js';
import { USER_ERRORS } from '@/shared/constants/error-codes/users.js';

export const ERROR_CODES = {
  ...USER_ERRORS,
  ...SYSTEM_ERRORS,
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
