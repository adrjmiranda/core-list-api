import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { env } from '#/shared/env/env.js';
import { AppError } from '#/shared/errors/AppError.js';

export async function verifyJWT(request: FastifyRequest, _reply: FastifyReply) {
	try {
		const authHeader = request.headers.authorization;

		if (!authHeader) {
			throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
		}

		const [_, token] = authHeader.split(' ');

		const decoded = jwt.verify(token, env.JWT_SECRET) as {
			sub: string;
			role: string;
			isVerified: boolean;
		};

		request.user = {
			sub: decoded.sub,
			role: decoded.role,
			isVerified: decoded.isVerified,
		};

		if (!request.user.isVerified) {
			throw new AppError(ERROR_CODES.USER_NOT_VERIFIED, 403);
		}
	} catch {
		throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
	}
}
