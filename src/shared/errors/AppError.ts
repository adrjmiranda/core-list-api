import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export class AppError extends Error {
  public readonly code: keyof typeof ERROR_CODES;
  public readonly statusCode: number;

  constructor(code: keyof typeof ERROR_CODES, statusCode = 400) {
    super(code);
    this.code = code;
    this.statusCode = statusCode;
  }
}
