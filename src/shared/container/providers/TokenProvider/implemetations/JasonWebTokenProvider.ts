import jwt, { SignOptions } from 'jsonwebtoken';

import {
	ITokenPayload,
	ITokenProvider,
} from '#/shared/container/providers/TokenProvider/models/ITokenProvider.js';
import { env } from '#/shared/env/env.js';

export class JasonWebTokenProvider implements ITokenProvider {
	generate(payload: object, subject: string, expiresIn: string): string {
		return jwt.sign(payload, env.JWT_SECRET, {
			subject,
			expiresIn: expiresIn as SignOptions['expiresIn'],
		});
	}

	verify(token: string): ITokenPayload {
		return jwt.verify(token, env.JWT_SECRET) as ITokenPayload;
	}
}
