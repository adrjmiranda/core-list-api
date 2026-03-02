import { SYSTEM_ERRORS } from '@/shared/constants/error-codes/system.js';
import { USER_ERRORS } from '@/shared/constants/error-codes/users.js';

import { COMMON_ERRORS } from './error-codes/common.js';
import { CONTACT_ERRORS } from './error-codes/contacts.js';

export const ERROR_CODES = {
  ...COMMON_ERRORS,
  ...USER_ERRORS,
  ...CONTACT_ERRORS,
  ...SYSTEM_ERRORS,
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
