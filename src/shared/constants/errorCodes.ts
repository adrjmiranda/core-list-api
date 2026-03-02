import { ADDRESSES_ERROR_CODES } from '@/shared/constants/error-codes/addresses.js';
import { COMMON_ERRORS } from '@/shared/constants/error-codes/common.js';
import { CONTACT_ERRORS } from '@/shared/constants/error-codes/contacts.js';
import { SYSTEM_ERRORS } from '@/shared/constants/error-codes/system.js';
import { USER_ERRORS } from '@/shared/constants/error-codes/users.js';

export const ERROR_CODES = {
  ...COMMON_ERRORS,
  ...USER_ERRORS,
  ...CONTACT_ERRORS,
  ...ADDRESSES_ERROR_CODES,
  ...SYSTEM_ERRORS,
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
